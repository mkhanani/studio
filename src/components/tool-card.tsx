'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/types';
import { ArrowUpRight, TestTubeDiagonal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  onLaunch: (tool: Tool) => void;
}

export function ToolCard({ tool, onLaunch }: ToolCardProps) {
  const router = useRouter();

  const handleLaunch = () => {
    if (tool.status !== 'active') return;
    onLaunch(tool);

    if (tool.type === 'API-integrated') {
      router.push(`/tools/${tool.id}`);
    } else {
      window.open(tool.launchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isActive = tool.status === 'active';

  return (
    <Card className={cn(
      "flex h-full transform flex-col transition-all duration-300",
      isActive ? "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20" : "opacity-60 bg-muted/50"
    )}>
      <CardHeader className="flex flex-row items-start gap-4">
        <Image
          src={tool.iconUrl}
          alt={`${tool.name} icon`}
          width={56}
          height={56}
          className="rounded-lg"
          data-ai-hint="logo"
        />
        <div>
          <CardTitle className="font-headline text-lg">{tool.name}</CardTitle>
          <CardDescription className="mt-1">{tool.type}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{tool.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge 
          variant={isActive ? "default" : "outline"} 
          className={cn(
            isActive ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'capitalize',
             !isActive && tool.status === 'inactive' && 'border-transparent bg-destructive/80 text-destructive-foreground'
            )}
        >
          {tool.status}
        </Badge>
        <Button size="sm" onClick={handleLaunch} disabled={!isActive}>
           {tool.type === 'API-integrated' ? 'Open' : 'Launch'}
           {tool.type === 'API-integrated' ? (
              <TestTubeDiagonal className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpRight className="ml-2 h-4 w-4" />
            )}
        </Button>
      </CardFooter>
    </Card>
  );
}
