'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onLaunch: (tool: Tool) => void;
}

export function ToolCard({ tool, onLaunch }: ToolCardProps) {
  const handleLaunch = () => {
    onLaunch(tool);
    window.open(tool.launchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="flex h-full transform flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
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
        <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className={tool.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}>
          {tool.status}
        </Badge>
        <Button size="sm" onClick={handleLaunch} disabled={tool.status !== 'active'}>
          Launch
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
