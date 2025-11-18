"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, X, RotateCcw, Eye } from "lucide-react";
import { TemplateTheme } from "@/lib/templates/contest-templates";
import { motion } from "framer-motion";

interface FormCustomizationPanelProps {
    theme: TemplateTheme;
    onThemeChange: (theme: TemplateTheme) => void;
    onClose: () => void;
    onPreview: () => void;
}

export function FormCustomizationPanel({
    theme,
    onThemeChange,
    onClose,
    onPreview,
}: FormCustomizationPanelProps) {
    const [localTheme, setLocalTheme] = useState<TemplateTheme>(theme);

    const handleColorChange = (key: keyof TemplateTheme, value: string) => {
        const updated = { ...localTheme, [key]: value };
        setLocalTheme(updated);
        onThemeChange(updated);
    };

    const handleReset = () => {
        setLocalTheme(theme);
        onThemeChange(theme);
    };

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l"
        >
            {/* Header */}
            <div className="border-b p-6 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Palette className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Customize Design</h2>
                            <p className="text-sm text-muted-foreground">Adjust colors and styling</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={onPreview} className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="colors" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="colors">Colors</TabsTrigger>
                        <TabsTrigger value="inputs">Inputs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Background Colors</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm mb-2 block">Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.backgroundColor}
                                            onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.backgroundColor}
                                            onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm mb-2 block">Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.primaryColor}
                                            onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.primaryColor}
                                            onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm mb-2 block">Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.secondaryColor}
                                            onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.secondaryColor}
                                            onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm mb-2 block">Accent Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.accentColor}
                                            onChange={(e) => handleColorChange("accentColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.accentColor}
                                            onChange={(e) => handleColorChange("accentColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Text Colors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label className="text-sm mb-2 block">Text Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.textColor}
                                            onChange={(e) => handleColorChange("textColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.textColor}
                                            onChange={(e) => handleColorChange("textColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Button Colors</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm mb-2 block">Button Background</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.buttonColor}
                                            onChange={(e) => handleColorChange("buttonColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.buttonColor}
                                            onChange={(e) => handleColorChange("buttonColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm mb-2 block">Button Text</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.buttonTextColor}
                                            onChange={(e) => handleColorChange("buttonTextColor", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.buttonTextColor}
                                            onChange={(e) => handleColorChange("buttonTextColor", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="inputs" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Input Field Styling</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm mb-2 block">Input Background</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.inputBackground}
                                            onChange={(e) => handleColorChange("inputBackground", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.inputBackground}
                                            onChange={(e) => handleColorChange("inputBackground", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm mb-2 block">Input Border</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={localTheme.inputBorder}
                                            onChange={(e) => handleColorChange("inputBorder", e.target.value)}
                                            className="h-10 w-20 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={localTheme.inputBorder}
                                            onChange={(e) => handleColorChange("inputBorder", e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Preview</CardTitle>
                                <CardDescription>See how your changes look</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="p-4 rounded-lg border"
                                    style={{ backgroundColor: localTheme.backgroundColor }}
                                >
                                    <div
                                        className="p-3 rounded mb-3"
                                        style={{
                                            backgroundColor: `${localTheme.inputBackground}80`,
                                            borderColor: localTheme.inputBorder,
                                            borderWidth: "1px",
                                            color: localTheme.textColor,
                                        }}
                                    >
                                        Sample Input Field
                                    </div>
                                    <button
                                        className="w-full py-2 px-4 rounded-lg font-semibold"
                                        style={{
                                            backgroundColor: localTheme.buttonColor,
                                            color: localTheme.buttonTextColor,
                                        }}
                                    >
                                        Sample Button
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    );
}

