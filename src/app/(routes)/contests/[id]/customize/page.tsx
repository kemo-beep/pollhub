"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Save, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Customization {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOverlay?: string;
    textColor?: string;
    accentColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    buttonStyle?: "rounded" | "square" | "pill";
    headerImage?: string;
    logo?: string;
    customCSS?: string;
}

const defaultCustomization: Customization = {
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#10b981",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
    buttonStyle: "rounded",
};

export default function CustomizePage() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customization, setCustomization] = useState<Customization>(defaultCustomization);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        fetchCustomization();
    }, [contestId]);

    const fetchCustomization = async () => {
        try {
            const response = await fetch(`/api/contests/${contestId}/customize`);
            if (!response.ok) {
                throw new Error("Failed to load customization");
            }
            const data = await response.json();
            if (data.customization && Object.keys(data.customization).length > 0) {
                setCustomization({ ...defaultCustomization, ...data.customization });
            }
        } catch (error) {
            console.error("Error fetching customization:", error);
            toast.error("Failed to load customization settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/contests/${contestId}/customize`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customization),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save customization");
            }

            toast.success("Customization saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save customization");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setCustomization(defaultCustomization);
        toast.info("Customization reset to defaults");
    };

    const updateCustomization = (field: keyof Customization, value: any) => {
        setCustomization((prev) => ({ ...prev, [field]: value }));
    };

    const generatePreviewStyles = () => {
        const styles: React.CSSProperties = {
            "--custom-primary": customization.primaryColor || defaultCustomization.primaryColor,
            "--custom-secondary": customization.secondaryColor || defaultCustomization.secondaryColor,
            "--custom-bg": customization.backgroundColor || defaultCustomization.backgroundColor,
            "--custom-text": customization.textColor || defaultCustomization.textColor,
            "--custom-accent": customization.accentColor || defaultCustomization.accentColor,
            fontFamily: customization.fontFamily || defaultCustomization.fontFamily,
        };

        if (customization.backgroundImage) {
            styles.backgroundImage = `url(${customization.backgroundImage})`;
            styles.backgroundSize = "cover";
            styles.backgroundPosition = "center";
            styles.backgroundRepeat = "no-repeat";
            styles.position = "relative";
        }

        if (customization.backgroundOverlay && customization.backgroundImage) {
            styles.position = "relative";
        }

        return styles;
    };

    const getButtonClass = () => {
        const base = "px-4 py-2 font-medium transition-colors";
        switch (customization.buttonStyle) {
            case "square":
                return `${base} rounded-none`;
            case "pill":
                return `${base} rounded-full`;
            default:
                return `${base} rounded-lg`;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-6xl py-8 px-4">
                <div className="text-center">Loading customization settings...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Palette className="h-6 w-6" />
                        Customize Voting Page
                    </h1>
                    <p className="text-muted-foreground">
                        Customize colors, styles, and branding for your voting page
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPreviewMode(!previewMode)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        {previewMode ? "Hide" : "Show"} Preview
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Customization Form */}
                <div className="space-y-6">
                    {/* Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Colors</CardTitle>
                            <CardDescription>Customize the color scheme</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="primaryColor">Primary Color</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="primaryColor"
                                            type="color"
                                            value={customization.primaryColor || defaultCustomization.primaryColor}
                                            onChange={(e) => updateCustomization("primaryColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customization.primaryColor || defaultCustomization.primaryColor}
                                            onChange={(e) => updateCustomization("primaryColor", e.target.value)}
                                            placeholder="#3b82f6"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="secondaryColor"
                                            type="color"
                                            value={customization.secondaryColor || defaultCustomization.secondaryColor}
                                            onChange={(e) => updateCustomization("secondaryColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customization.secondaryColor || defaultCustomization.secondaryColor}
                                            onChange={(e) => updateCustomization("secondaryColor", e.target.value)}
                                            placeholder="#8b5cf6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="backgroundColor">Background Color</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="backgroundColor"
                                            type="color"
                                            value={customization.backgroundColor || defaultCustomization.backgroundColor}
                                            onChange={(e) => updateCustomization("backgroundColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customization.backgroundColor || defaultCustomization.backgroundColor}
                                            onChange={(e) => updateCustomization("backgroundColor", e.target.value)}
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="backgroundImage">Background Image URL</Label>
                                    <Input
                                        id="backgroundImage"
                                        type="url"
                                        value={customization.backgroundImage || ""}
                                        onChange={(e) => updateCustomization("backgroundImage", e.target.value)}
                                        placeholder="https://example.com/background.jpg"
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Full-page background image (like Notion pages)
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="backgroundOverlay">Background Overlay (RGBA)</Label>
                                    <Input
                                        id="backgroundOverlay"
                                        type="text"
                                        value={customization.backgroundOverlay || "rgba(255, 255, 255, 0.8)"}
                                        onChange={(e) => updateCustomization("backgroundOverlay", e.target.value)}
                                        placeholder="rgba(255, 255, 255, 0.8)"
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Overlay color for better text readability (e.g., rgba(255, 255, 255, 0.9))
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="textColor">Text Color</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="textColor"
                                            type="color"
                                            value={customization.textColor || defaultCustomization.textColor}
                                            onChange={(e) => updateCustomization("textColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customization.textColor || defaultCustomization.textColor}
                                            onChange={(e) => updateCustomization("textColor", e.target.value)}
                                            placeholder="#1f2937"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="accentColor">Accent Color</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="accentColor"
                                            type="color"
                                            value={customization.accentColor || defaultCustomization.accentColor}
                                            onChange={(e) => updateCustomization("accentColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customization.accentColor || defaultCustomization.accentColor}
                                            onChange={(e) => updateCustomization("accentColor", e.target.value)}
                                            placeholder="#10b981"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Typography & Style */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Typography & Style</CardTitle>
                            <CardDescription>Customize fonts and button styles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="fontFamily">Font Family</Label>
                                <select
                                    id="fontFamily"
                                    value={customization.fontFamily || defaultCustomization.fontFamily}
                                    onChange={(e) => updateCustomization("fontFamily", e.target.value)}
                                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                >
                                    <option value="Inter, sans-serif">Inter</option>
                                    <option value="Roboto, sans-serif">Roboto</option>
                                    <option value="Open Sans, sans-serif">Open Sans</option>
                                    <option value="Lato, sans-serif">Lato</option>
                                    <option value="Poppins, sans-serif">Poppins</option>
                                    <option value="Montserrat, sans-serif">Montserrat</option>
                                    <option value="system-ui, sans-serif">System Default</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="borderRadius">Border Radius</Label>
                                <Input
                                    id="borderRadius"
                                    type="text"
                                    value={customization.borderRadius || defaultCustomization.borderRadius}
                                    onChange={(e) => updateCustomization("borderRadius", e.target.value)}
                                    placeholder="0.5rem"
                                />
                            </div>
                            <div>
                                <Label htmlFor="buttonStyle">Button Style</Label>
                                <select
                                    id="buttonStyle"
                                    value={customization.buttonStyle || defaultCustomization.buttonStyle}
                                    onChange={(e) => updateCustomization("buttonStyle", e.target.value as any)}
                                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                >
                                    <option value="rounded">Rounded</option>
                                    <option value="square">Square</option>
                                    <option value="pill">Pill</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branding */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>Add your logo and header image</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="logo">Logo URL</Label>
                                <Input
                                    id="logo"
                                    type="url"
                                    value={customization.logo || ""}
                                    onChange={(e) => updateCustomization("logo", e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                            <div>
                                <Label htmlFor="headerImage">Header Image URL</Label>
                                <Input
                                    id="headerImage"
                                    type="url"
                                    value={customization.headerImage || ""}
                                    onChange={(e) => updateCustomization("headerImage", e.target.value)}
                                    placeholder="https://example.com/header.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced CSS */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Advanced CSS</CardTitle>
                            <CardDescription>Add custom CSS for advanced styling</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={customization.customCSS || ""}
                                onChange={(e) => updateCustomization("customCSS", e.target.value)}
                                placeholder=".custom-class { color: red; }"
                                rows={6}
                                className="font-mono text-sm"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="lg:sticky lg:top-8 lg:h-fit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Preview</CardTitle>
                            <CardDescription>See how your voting page will look</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="rounded-lg border p-6 space-y-4 relative overflow-hidden"
                                style={generatePreviewStyles()}
                            >
                                {customization.backgroundImage && (
                                    <>
                                        <div
                                            className="absolute inset-0 -z-10"
                                            style={{
                                                backgroundImage: `url(${customization.backgroundImage})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            }}
                                        />
                                        {customization.backgroundOverlay && (
                                            <div
                                                className="absolute inset-0 -z-10"
                                                style={{
                                                    backgroundColor: customization.backgroundOverlay,
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                                {customization.headerImage && (
                                    <img
                                        src={customization.headerImage}
                                        alt="Header"
                                        className="w-full h-32 object-cover rounded-lg relative z-0"
                                    />
                                )}
                                <div className="flex items-center gap-3 relative z-0">
                                    {customization.logo && (
                                        <img
                                            src={customization.logo}
                                            alt="Logo"
                                            className="h-12 w-12 rounded relative z-0"
                                        />
                                    )}
                                    <div className="relative z-0">
                                        <h2
                                            className="text-2xl font-bold"
                                            style={{ color: customization.textColor || defaultCustomization.textColor }}
                                        >
                                            Contest Title
                                        </h2>
                                        <p className="text-sm opacity-70">Contest description goes here</p>
                                    </div>
                                </div>
                                <div className="space-y-2 relative z-0">
                                    <div
                                        className="p-3 rounded-lg border relative z-0"
                                        style={{
                                            backgroundColor: customization.backgroundImage
                                                ? (customization.backgroundColor || "rgba(255, 255, 255, 0.9)")
                                                : (customization.backgroundColor || defaultCustomization.backgroundColor),
                                            borderRadius: customization.borderRadius || defaultCustomization.borderRadius,
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                                style={{
                                                    backgroundColor: customization.primaryColor || defaultCustomization.primaryColor,
                                                }}
                                            >
                                                1
                                            </div>
                                            <span style={{ color: customization.textColor || defaultCustomization.textColor }}>
                                                Contestant Name
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={getButtonClass()}
                                    style={{
                                        backgroundColor: customization.primaryColor || defaultCustomization.primaryColor,
                                        color: "#ffffff",
                                    }}
                                >
                                    Submit Vote
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

