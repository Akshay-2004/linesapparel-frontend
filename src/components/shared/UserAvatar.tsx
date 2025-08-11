"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar = ({ 
  name, 
  imageUrl, 
  size = "md", 
  className 
}: UserAvatarProps) => {
  // Generate initials from name
  const getInitials = (fullName: string): string => {
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return 'U'; // Default fallback
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    
    // Use first letter of first name and first letter of last name
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm", 
    lg: "size-12 text-base",
    xl: "size-16 text-lg"
  };

  const hasValidImage = imageUrl && imageUrl.trim() !== '';

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {hasValidImage && (
        <AvatarImage 
          src={imageUrl} 
          alt={name}
          onError={(e) => {
            // Hide image on error to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold border-1 border-primary-3">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
