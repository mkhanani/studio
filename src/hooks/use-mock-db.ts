"use client";

import { useState } from 'react';
import { mockUsers, mockTools, mockLogs } from '@/lib/mock-data';
import type { User, Tool, Log } from '@/lib/types';

const useMockDb = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [logs, setLogs] = useState<Log[]>(mockLogs);

  const addLog = (logData: Omit<Log, 'id' | 'timestamp'>) => {
    const newLog: Log = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };
  
  return { users, tools, logs, addLog, setUsers, setTools, setLogs };
};

export default useMockDb;
