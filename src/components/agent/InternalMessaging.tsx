
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Circle,
  Search,
  Users,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  urgent: boolean;
}

interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  agentId: string;
  department: string;
}

interface InternalMessagingProps {
  currentUserId: string;
  currentUserName: string;
}

// Mock data for agents
const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'Sarah Peterson', status: 'available', agentId: 'AGT-001', department: 'Customer Service' },
  { id: '2', name: 'Mike Johnson', status: 'busy', agentId: 'AGT-002', department: 'Technical Support' },
  { id: '3', name: 'Emily Davis', status: 'available', agentId: 'AGT-003', department: 'Billing' },
  { id: '4', name: 'Robert Wilson', status: 'away', agentId: 'AGT-004', department: 'Supervisor' },
  { id: '5', name: 'Lisa Chen', status: 'available', agentId: 'AGT-005', department: 'Customer Service' },
  { id: '6', name: 'David Brown', status: 'offline', agentId: 'AGT-006', department: 'Technical Support' }
];

// Mock messages
const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg1',
    senderId: '2',
    senderName: 'Mike Johnson',
    recipientId: 'current',
    recipientName: 'You',
    content: 'Can you help me with a technical issue? Customer is having trouble with their account login.',
    timestamp: '2025-06-14T14:30:00',
    read: false,
    urgent: true
  },
  {
    id: 'msg2',
    senderId: 'current',
    senderName: 'You',
    recipientId: '2',
    recipientName: 'Mike Johnson',
    content: 'Sure, what specific error are they seeing?',
    timestamp: '2025-06-14T14:32:00',
    read: true,
    urgent: false
  },
  {
    id: 'msg3',
    senderId: '4',
    senderName: 'Robert Wilson',
    recipientId: 'current',
    recipientName: 'You',
    content: 'Team meeting in 15 minutes in the main conference room.',
    timestamp: '2025-06-14T13:45:00',
    read: true,
    urgent: false
  }
];

export const InternalMessaging = ({ currentUserId, currentUserName }: InternalMessagingProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessagingDialog, setShowMessagingDialog] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter agents based on search
  const filteredAgents = MOCK_AGENTS.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unread message count
  const unreadCount = messages.filter(msg => 
    msg.recipientId === 'current' && !msg.read
  ).length;

  // Get conversation with selected agent
  const getConversation = (agentId: string) => {
    return messages.filter(msg =>
      (msg.senderId === agentId && msg.recipientId === 'current') ||
      (msg.senderId === 'current' && msg.recipientId === agentId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedAgent) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current',
      senderName: currentUserName,
      recipientId: selectedAgent.id,
      recipientName: selectedAgent.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      urgent: isUrgent
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsUrgent(false);

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedAgent.name}`,
    });

    // Simulate a response after a delay
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const response: Message = {
          id: `response-${Date.now()}`,
          senderId: selectedAgent.id,
          senderName: selectedAgent.name,
          recipientId: 'current',
          recipientName: currentUserName,
          content: `Thanks for the message! I'll get back to you on this.`,
          timestamp: new Date().toISOString(),
          read: false,
          urgent: false
        };
        setMessages(prev => [...prev, response]);
      }
    }, 2000 + Math.random() * 3000);
  };

  // Mark messages as read
  const markAsRead = (agentId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.senderId === agentId && msg.recipientId === 'current'
          ? { ...msg, read: true }
          : msg
      )
    );
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedAgent]);

  // Select agent and mark messages as read
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    markAsRead(agent.id);
  };

  return (
    <Dialog open={showMessagingDialog} onOpenChange={setShowMessagingDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <MessageSquare className="mr-2 h-4 w-4" />
          Messages
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Internal Messaging
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[500px]">
          {/* Agent List */}
          <div className="w-1/3 border-r">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredAgents.map((agent) => {
                    const conversation = getConversation(agent.id);
                    const lastMessage = conversation[conversation.length - 1];
                    const unreadInConversation = conversation.filter(msg => 
                      msg.senderId === agent.id && !msg.read
                    ).length;
                    
                    return (
                      <div
                        key={agent.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAgent?.id === agent.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleAgentSelect(agent)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <div className="bg-muted rounded-full p-1">
                                <User className="h-4 w-4" />
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}></div>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">{agent.department}</p>
                            </div>
                          </div>
                          {unreadInConversation > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {unreadInConversation}
                            </Badge>
                          )}
                        </div>
                        {lastMessage && (
                          <div className="text-xs text-muted-foreground truncate">
                            {lastMessage.senderId === 'current' ? 'You: ' : ''}{lastMessage.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Conversation */}
          <div className="flex-1 flex flex-col">
            {selectedAgent ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="bg-muted rounded-full p-2">
                        <User className="h-5 w-5" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedAgent.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedAgent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgent.agentId} • {selectedAgent.department} • {selectedAgent.status}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {getConversation(selectedAgent.id).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === 'current'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {message.urgent && (
                              <Badge variant="destructive" className="h-4 text-xs px-1">
                                <Bell className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant={isUrgent ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsUrgent(!isUrgent)}
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      {isUrgent ? 'Urgent' : 'Normal'}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder={`Type a message to ${selectedAgent.name}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="resize-none"
                      rows={2}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Select an agent to start messaging</h3>
                  <p className="text-muted-foreground">
                    Choose from the list of available agents to begin a conversation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
