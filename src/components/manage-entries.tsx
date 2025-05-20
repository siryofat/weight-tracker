
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { getEntries, updateEntry, deleteEntry } from "@/lib/storage";
import type { WeightEntry } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Trash2, CalendarIcon, Save, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Form schema does not include 'updatedAt' as it's managed internally
const formSchema = z.object({
  id: z.string(),
  date: z.date({ required_error: "Date is required." }),
  currentWeight: z.coerce
    .number({ required_error: "Weight is required." })
    .positive("Weight must be positive."),
  fatPercentage: z.coerce
    .number()
    .min(0, "Fat % cannot be negative.")
    .max(100, "Fat % cannot exceed 100.")
    .optional()
    .or(z.literal("")),
  musclePercentage: z.coerce
    .number()
    .min(0, "Muscle % cannot be negative.")
    .max(100, "Muscle % cannot exceed 100.")
    .optional()
    .or(z.literal("")),
});

type FormValues = Omit<WeightEntry, 'updatedAt'>; // Form doesn't directly edit updatedAt

type SortableKey = 'date' | 'updatedAt'; // Keys we can sort by

export default function ManageEntries() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<WeightEntry | null>(null);
  const { toast } = useToast();

  const [sortConfig, setSortConfig] = useState<{ key: SortableKey; direction: 'ascending' | 'descending' }>({
    key: 'date',
    direction: 'ascending',
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const loadEntries = useCallback(() => {
    setEntries(getEntries()); // getEntries already sorts by entry date ASC by default
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const sortedEntries = useMemo(() => {
    let sortableEntries = [...entries];
    if (sortConfig.key === 'date') {
      // getEntries provides entries sorted by 'date' ascending.
      // If descending is needed, reverse the array.
      if (sortConfig.direction === 'descending') {
        sortableEntries.reverse();
      }
    } else if (sortConfig.key === 'updatedAt') {
      sortableEntries.sort((a, b) => {
        // Fallback to entry.date if updatedAt is somehow missing (should not happen with new logic)
        const dateA = new Date(a.updatedAt || a.date).getTime();
        const dateB = new Date(b.updatedAt || b.date).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      });
    }
    return sortableEntries;
  }, [entries, sortConfig]);

  const requestSort = (key: SortableKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return sortConfig.direction === 'ascending' ? 
           <ArrowUp className="ml-2 h-4 w-4" /> : 
           <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleEditOpen = (entry: WeightEntry) => {
    setCurrentEntry(entry);
    form.reset({
      id: entry.id,
      date: parseISO(entry.date),
      currentWeight: entry.currentWeight,
      fatPercentage: entry.fatPercentage ?? undefined,
      musclePercentage: entry.musclePercentage ?? undefined,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpen = (entry: WeightEntry) => {
    setCurrentEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const onEditSubmit = (values: FormValues) => {
    if (!currentEntry) return;
    // Construct updated entry, 'updatedAt' will be set by updateEntry function
    const entryToUpdate: WeightEntry = {
      ...currentEntry, // Preserve existing updatedAt if needed, though updateEntry will overwrite
      ...values,
      date: values.date.toISOString(),
      fatPercentage: values.fatPercentage === "" ? undefined : values.fatPercentage,
      musclePercentage: values.musclePercentage === "" ? undefined : values.musclePercentage,
    };
    updateEntry(entryToUpdate);
    toast({
      title: "Entry Updated!",
      description: "The entry has been successfully updated.",
    });
    setIsEditDialogOpen(false);
    loadEntries(); // Reload to get fresh data including new updatedAt
  };

  const onDeleteConfirm = () => {
    if (!currentEntry) return;
    deleteEntry(currentEntry.id);
    toast({
      title: "Entry Deleted!",
      description: "The entry has been successfully deleted.",
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    setCurrentEntry(null);
    loadEntries();
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No entries found. Add some data first!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Your Entries</CardTitle>
        <CardDescription>Review, edit, or delete your past weight entries. Click table headers to sort.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('date')} className="px-1">
                  Entry Date {getSortIcon('date')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">Fat %</TableHead>
              <TableHead className="text-right">Muscle %</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('updatedAt')} className="px-1">
                  Last Modified {getSortIcon('updatedAt')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(parseISO(entry.date), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right">{entry.currentWeight.toFixed(1)}</TableCell>
                <TableCell className="text-right">
                  {entry.fatPercentage !== undefined ? entry.fatPercentage.toFixed(1) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {entry.musclePercentage !== undefined ? entry.musclePercentage.toFixed(1) : "-"}
                </TableCell>
                <TableCell>{format(parseISO(entry.updatedAt), "MMM dd, yyyy HH:mm")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditOpen(entry)}>
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteOpen(entry)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Entry</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-6 py-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Entry</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Weight (kg/lbs)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 70.5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Fat Percentage (%) (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 15.2" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="musclePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muscle Percentage (%) (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 40.0" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the entry for
                {currentEntry && ` ${format(parseISO(currentEntry.date), "MMM dd, yyyy")}`}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCurrentEntry(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
