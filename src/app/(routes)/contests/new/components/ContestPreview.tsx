import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContestFormData, Category } from "../types";

interface ContestPreviewProps {
    formData: ContestFormData;
    categories: Category[];
    onBack: () => void;
    onCreate: () => void;
    loading: boolean;
}

export function ContestPreview({
    formData,
    categories,
    onBack,
    onCreate,
    loading,
}: ContestPreviewProps) {
    return (
        <div className="min-h-screen bg-slate-100 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-4 flex justify-between items-center">
                    <Button variant="outline" onClick={onBack}>
                        Back to Editor
                    </Button>
                    <Button onClick={onCreate} disabled={loading}>
                        {loading ? "Creating..." : "Create Contest"}
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            {formData.name || "Untitled Contest"}
                        </CardTitle>
                        {formData.description && (
                            <CardDescription className="text-base">
                                {formData.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {categories.map((cat, idx) => (
                            <div key={cat.id} className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    {idx + 1}. {cat.name}
                                </h3>
                                {cat.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {cat.description}
                                    </p>
                                )}
                                <div className="space-y-2">
                                    {cat.contestants.map((c) => (
                                        <div key={c.id} className="p-2 border rounded">
                                            {c.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

