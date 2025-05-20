
import type { WeightEntry } from '@/types';

const STORAGE_KEY = 'weightWiseEntries';

// Sorts entries by their primary 'date' (entry date)
const sortEntriesByDate = (entries: WeightEntry[]): WeightEntry[] => {
  return entries
    .map(entry => ({ ...entry, dateObj: new Date(entry.date) })) // temp property for sorting
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .map(({ dateObj, ...entry }) => entry); // remove temp property and ensure date is ISO string
};

export const getEntries = (): WeightEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedEntries = localStorage.getItem(STORAGE_KEY);
    if (storedEntries) {
      const parsedEntries: WeightEntry[] = JSON.parse(storedEntries);
      // Ensure all entries have an updatedAt field, defaulting to their date if missing (for backward compatibility)
      const entriesWithUpdatedAt = parsedEntries.map(entry => ({
        ...entry,
        updatedAt: entry.updatedAt || entry.date, 
      }));
      return sortEntriesByDate(entriesWithUpdatedAt);
    }
    return [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const addEntry = (entryData: Omit<WeightEntry, 'id' | 'updatedAt'>): WeightEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const entries = getEntries();
  const now = new Date().toISOString();
  const newEntry: WeightEntry = {
    ...entryData,
    id: new Date(entryData.date).toISOString() + '-' + Math.random().toString(36).substring(2, 9),
    updatedAt: now, // Set updatedAt to current time on creation
  };
  const updatedEntries = [...entries, newEntry];
  try {
    const sortedEntries = sortEntriesByDate(updatedEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEntries));
    return sortedEntries;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return sortEntriesByDate(updatedEntries); 
  }
};

export const updateEntry = (updatedEntryData: WeightEntry): WeightEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  let entries = getEntries();
  const now = new Date().toISOString();
  entries = entries.map(entry => 
    entry.id === updatedEntryData.id 
      ? { ...updatedEntryData, updatedAt: now } // Update updatedAt timestamp
      : entry
  );
  try {
    const sortedEntries = sortEntriesByDate(entries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEntries));
    return sortedEntries;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return sortEntriesByDate(entries);
  }
};

export const deleteEntry = (entryId: string): WeightEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  let entries = getEntries();
  entries = entries.filter(entry => entry.id !== entryId);
  try {
    const sortedEntries = sortEntriesByDate(entries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEntries));
    return sortedEntries;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return sortEntriesByDate(entries);
  }
};
