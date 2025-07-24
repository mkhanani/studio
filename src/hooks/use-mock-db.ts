"use client";

import { useState, useEffect } from 'react';
import { mockUsers, mockTools, mockLogs } from '@/lib/mock-data';
import type { User, Tool, Log } from '@/lib/types';

const useMockDb = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    // Initialize from mock data, but you could fetch from a real API here
    setUsers(mockUsers);
    setTools(mockTools);
    setLogs(mockLogs);
  }, []);

  const addLog = (logData: Omit<Log, 'id' | 'timestamp'>) => {
    const newLog: Log = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const addUser = (user: Omit<User, 'id' | 'assignedTools' | 'avatarUrl'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      assignedTools: [],
      avatarUrl: `https://avatar.vercel.sh/${user.email}.png`
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  const removeUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  const addTool = (tool: Omit<Tool, 'id'>) => {
      const newTool: Tool = {
          ...tool,
          id: `tool-${Date.now()}`
      };
      setTools(prevTools => [newTool, ...prevTools]);
  }

  const updateTool = (updatedTool: Tool) => {
      setTools(prevTools => prevTools.map(tool => tool.id === updatedTool.id ? updatedTool : tool));
  }


  return { users, tools, logs, addLog, setUsers, setTools, setLogs, addUser, removeUser, addTool, updateTool };
};

export default useMockDb;
