import * as React from "react";
import { useNavigate } from "react-router";
import {
    LayoutDashboard,
    Building2,
    Home,
    Users,
    FileText,
    DollarSign,
    TrendingUp,
    Wrench,
    UserCircle,
    CreditCard,
    Settings,
    Search,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "./ui/command";

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative flex h-9 w-full items-center justify-start rounded-[0.5rem] bg-background px-3 py-2 text-sm font-normal text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-accent-foreground sm:pr-12 md:w-40 lg:w-64 border border-border"
            >
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="inline-flex">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/properties"))}>
                            <Building2 className="mr-2 h-4 w-4" />
                            <span>Properties</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/units"))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Units</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/tenants"))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Tenants</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/leases"))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Leases</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Finances">
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/rent-collection"))}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Rent Collection</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/financials"))}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            <span>Financials</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/billing"))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
