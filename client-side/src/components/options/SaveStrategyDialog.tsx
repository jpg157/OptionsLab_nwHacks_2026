import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isLoggedIn } from "@/lib/auth";

interface SaveStrategyDialogProps {
  currentName: string;
  onSave: (name: string) => Promise<void>;
  isSaving: boolean;
}

// FIX: Named export to match 'import { SaveStrategyDialog }'
export function SaveStrategyDialog({ currentName, onSave, isSaving }: SaveStrategyDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);

  const handleOpen = async () => {
    if (!(await isLoggedIn())) {
      alert("Please log in to save strategies")
      return;
    }
    setOpen(true)
  }

  const handleSave = async () => {
    await onSave(name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild> */}
      <Button 
        onClick={handleOpen}
        variant="outline" 
        size="sm" 
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        Save Strategy
      </Button>
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Strategy</DialogTitle>
          <DialogDescription>
            Give your strategy a name to save it for later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Strategy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
