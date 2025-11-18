"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
    url: string;
    title?: string;
    size?: number;
}

export function QRCodeGenerator({ url, title = "Share Contest", size = 256 }: QRCodeGeneratorProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        generateQRCode();
    }, [url, size]);

    const generateQRCode = async () => {
        setLoading(true);
        try {
            const dataUrl = await QRCode.toDataURL(url, {
                width: size,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            });
            setQrDataUrl(dataUrl);
        } catch (error) {
            console.error("Error generating QR code:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadQRCode = () => {
        if (!qrDataUrl) return;
        const link = document.createElement("a");
        link.download = `pollhub-qrcode-${Date.now()}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Scan this QR code to access the voting page
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 w-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : qrDataUrl ? (
                        <>
                            <div className="p-4 bg-white rounded-lg">
                                <img src={qrDataUrl} alt="QR Code" className="w-full h-auto" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={downloadQRCode} variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(url);
                                    }}
                                    variant="outline"
                                >
                                    Copy Link
                                </Button>
                            </div>
                        </>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}

