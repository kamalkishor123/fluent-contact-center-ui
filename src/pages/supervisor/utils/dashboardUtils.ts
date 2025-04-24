
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready':
      return 'bg-cc-agent-available text-white';
    case 'not-ready':
      return 'bg-cc-agent-away text-black';
    case 'on-call':
      return 'bg-cc-agent-busy text-white';
    case 'wrap-up':
      return 'bg-cc-agent-busy/70 text-white';
    default:
      return 'bg-cc-agent-offline text-white';
  }
};
