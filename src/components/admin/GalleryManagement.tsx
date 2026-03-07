import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type GalleryImage = Tables<"gallery_images">;

const GalleryManagement = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      });
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload Failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("gallery_images").insert({
      image_url: urlData.publicUrl,
      title: title || null,
      display_order: images.length,
    });

    if (insertError) {
      toast({
        title: "Error",
        description: "Failed to save image to database",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      setTitle("");
      fetchImages();
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    const fileName = imageUrl.split("/").pop();

    if (fileName) {
      await supabase.storage.from("gallery").remove([fileName]);
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Image removed successfully",
      });
      fetchImages();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">
          Add New Image
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Image title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button variant="hero" disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload Image
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">
          Gallery Images ({images.length})
        </h2>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No images in gallery yet. Upload your first image above.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                    <p className="text-xs text-foreground truncate">
                      {image.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
