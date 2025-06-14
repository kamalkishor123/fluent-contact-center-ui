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
  Bell,
  X,
  Minimize2,
  Maximize2
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
  const [isMinimized, setIsMinimized] = useState(false);
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
        return 'status-available';
      case 'busy':
        return 'status-busy';
      case 'away':
        return 'status-away';
      case 'offline':
        return 'status-offline';
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
        <Button variant="outline" className="relative interactive shadow-md hover:shadow-lg">
          <MessageSquare className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={`transition-all duration-300 ${
        isMinimized ? 'sm:max-w-[400px] h-[200px]' : 'sm:max-w-[1000px] h-[700px]'
      } p-0 animate-scale-in`}>
        <DialogHeader className="p-4 pb-0 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-responsive-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Internal Messaging
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="interactive"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessagingDialog(false)}
                className="interactive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {!isMinimized && (
          <div className="flex h-[600px]">
            {/* Enhanced Agent List */}
            <div className="w-full md:w-1/3 border-r bg-muted/20">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agents..."
                    className="pl-9 bg-background/50 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-1">
                  {filteredAgents.map((agent) => {
                    const conversation = getConversation(agent.id);
                    const lastMessage = conversation[conversation.length - 1];
                    const unreadInConversation = conversation.filter(msg => 
                      msg.senderId === agent.id && !msg.read
                    ).length;
                    
                    return (
                      <div
                        key={agent.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 interactive-subtle ${
                          selectedAgent?.id === agent.id
                            ? 'bg-primary/10 border border-primary/20 shadow-md'
                            : 'hover:bg-background/80 hover:shadow-sm'
                        }`}
                        onClick={() => handleAgentSelect(agent)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="bg-muted rounded-full p-2 shadow-sm">
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
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse">
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
            
            {/* Enhanced Conversation */}
            <div className="flex-1 flex flex-col bg-background/50">
              {selectedAgent ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="bg-muted rounded-full p-2 shadow-sm">
                          <User className="h-5 w-5" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedAgent.status)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-responsive-base">{selectedAgent.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgent.agentId} • {selectedAgent.department} • 
                          <span className="capitalize ml-1">{selectedAgent.status}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Messages */}
                  <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/30 to-muted/10">
                    <div className="space-y-4">
                      {getConversation(selectedAgent.id).map((message) => (
                        <div
                          key={message.id}
                          className={`flex animate-fade-in ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                              message.senderId === 'current'
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-card border'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {message.urgent && (
                                <Badge variant="destructive" className="h-4 text-xs px-2 animate-pulse">
                                  <Bell className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                              <span className={`text-xs ${
                                message.senderId === 'current' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
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
                  
                  {/* Enhanced Message Input */}
                  <div className="p-4 border-t bg-muted/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant={isUrgent ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsUrgent(!isUrgent)}
                        className="interactive shadow-sm"
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        {isUrgent ? 'Urgent' : 'Normal'}
                      </Button>
                    </div>
                    <div className="flex gap-3">
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
                        className="resize-none bg-background/80 backdrop-blur-sm shadow-sm"
                        rows={2}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim()}
                        className="btn-primary self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center animate-fade-in">
                  <div className="text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-responsive-lg font-medium mb-2">Select an agent to start messaging</h3>
                    <p className="text-muted-foreground text-responsive-base">
                      Choose from the list of available agents to begin a conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {isMinimized && (
          <div className="p-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">
                {selectedAgent ? `Chatting with ${selectedAgent.name}` : 'Internal Messaging'}
              </span>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {unreadCount} new
              </Badge>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
