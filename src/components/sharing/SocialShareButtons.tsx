"use client";

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
    EmailIcon,
} from "react-share";
import { Share2 } from "lucide-react";

interface SocialShareButtonsProps {
    url: string;
    title: string;
    description?: string;
    size?: number;
    showLabel?: boolean;
}

export function SocialShareButtons({
    url,
    title,
    description = "",
    size = 32,
    showLabel = false,
}: SocialShareButtonsProps) {
    const shareText = description ? `${title} - ${description}` : title;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {showLabel && (
                <span className="text-sm text-muted-foreground mr-2 flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share:
                </span>
            )}
            <TwitterShareButton url={url} title={shareText} className="cursor-pointer">
                <TwitterIcon size={size} round />
            </TwitterShareButton>
            <FacebookShareButton url={url} quote={shareText} className="cursor-pointer">
                <FacebookIcon size={size} round />
            </FacebookShareButton>
            <LinkedinShareButton url={url} title={title} summary={description} className="cursor-pointer">
                <LinkedinIcon size={size} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={url} title={shareText} className="cursor-pointer">
                <WhatsappIcon size={size} round />
            </WhatsappShareButton>
            <EmailShareButton url={url} subject={title} body={description} className="cursor-pointer">
                <EmailIcon size={size} round />
            </EmailShareButton>
        </div>
    );
}

