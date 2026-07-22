import React from 'react';
import { Card, CardBody, Body, Badge } from '@/components/ui';
import { User } from '@/types/user';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const isDealer = user.role === 'dealer';
  const name = isDealer && user.dealerName ? user.dealerName : `${user.firstName} ${user.lastName}`;
  
  return (
    <Card className="mb-4 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <Body className="font-bold truncate">{name}</Body>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isDealer ? 'primary' : 'secondary'} size="sm" className="capitalize">
                {user.role}
              </Badge>
              {user.isVerified && (
                <Badge variant="success" size="sm">Verified</Badge>
              )}
            </div>
          </div>
        </div>
        <button className="text-sm font-bold text-[#CD2C58] hover:underline whitespace-nowrap ml-4">
          View
        </button>
      </CardBody>
    </Card>
  );
}
