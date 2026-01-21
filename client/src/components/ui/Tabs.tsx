import React from 'react';
import { Tab } from '@headlessui/react';
import { cn } from '../../lib/utils';

interface TabItem {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    items: TabItem[];
}

export function Tabs({ items }: TabsProps) {
    return (
        <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-brand-50 p-1 mb-6">
                {items.map((item) => (
                    <Tab
                        key={item.label}
                        className={({ selected }) =>
                            cn(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all',
                                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-brand-50 ring-brand-300',
                                selected
                                    ? 'bg-white text-brand-700 shadow shadow-brand-900/5'
                                    : 'text-brand-600 hover:bg-white/[0.12] hover:text-brand-800'
                            )
                        }
                    >
                        {item.label}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels>
                {items.map((item, idx) => (
                    <Tab.Panel
                        key={idx}
                        className={cn(
                            'rounded-xl bg-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white ring-brand-300'
                        )}
                    >
                        {item.content}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
}
