
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Save, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
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

export default function DataEntryForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      currentWeight: undefined, 
      fatPercentage: undefined,
      musclePercentage: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const entryData = {
      date: values.date.toISOString(), // Ensure date is in ISO string format
      currentWeight: values.currentWeight,
      fatPercentage: values.fatPercentage === "" ? undefined : values.fatPercentage,
      musclePercentage: values.musclePercentage === "" ? undefined : values.musclePercentage,
    };
    addEntry(entryData);
    toast({
      title: "Entry Saved!",
      description: "Your new weight entry has been successfully recorded.",
      variant: "default",
    });
    form.reset({
      date: new Date(), // Reset date to today
      currentWeight: undefined,
      fatPercentage: undefined,
      musclePercentage: undefined,
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log New Entry</CardTitle>
        <CardDescription>Enter your current metrics. Consistency is key!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date for this entry. Defaults to today.
                  </FormDescription>
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
                  <FormDescription>
                    Enter your current weight. This field is mandatory.
                  </FormDescription>
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
                  <FormDescription>
                    Enter your body fat percentage, if known.
                  </FormDescription>
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
                  <FormDescription>
                    Enter your muscle mass percentage, if known.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save Entry
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
