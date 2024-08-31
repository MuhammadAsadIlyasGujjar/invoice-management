export class ExpenseCategory {
    label!: string;
    value!: string;
    items?: ExpenseCategory[];
}

const expenseCategories: ExpenseCategory[] = [
    {
        label: 'Cost of Goods Sold (COGS)',
        value: 'cogs',
        items: [
            { label: 'Freight and Shipping Costs', value: 'freight-shipping' },
            { label: 'Customs and Import Duties', value: 'customs-import' },
            { label: 'Inventory Purchases', value: 'inventory-purchases' },
        ]
    },
    {
        label: 'Operating Expenses',
        value: 'operating-expenses',
        items: [
            {
                label: 'Rent/Lease Expenses',
                value: 'rent-lease',
                items: [
                    { label: 'Warehouse Rent', value: 'warehouse-rent' },
                    { label: 'Office Rent', value: 'office-rent' }
                ]
            },
            {
                label: 'Utilities',
                value: 'utilities',
                items: [
                    { label: 'Electricity, Water, and Gas', value: 'electricity-water-gas' },
                    { label: 'Internet and Phone', value: 'internet-phone' }
                ]
            },
            {
                label: 'Salaries and Wages',
                value: 'salaries-wages',
                items: [
                    { label: 'Administrative Staff', value: 'admin-staff' },
                    { label: 'Warehouse Staff', value: 'warehouse-staff' },
                    { label: 'Sales Team', value: 'sales-team' }
                ]
            },
            {
                label: 'Employee Benefits',
                value: 'employee-benefits',
                items: [
                    { label: 'Health Insurance', value: 'health-insurance' },
                    { label: 'Retirement Contributions', value: 'retirement-contributions' },
                    { label: 'Payroll Taxes', value: 'payroll-taxes' }
                ]
            }
        ]
    },
    {
        label: 'Selling, General, and Administrative (SG&A) Expenses',
        value: 'sga-expenses',
        items: [
            {
                label: 'Marketing and Advertising',
                value: 'marketing-advertising',
                items: [
                    { label: 'Online Advertising', value: 'online-advertising' },
                    { label: 'Traditional Advertising', value: 'traditional-advertising' },
                    { label: 'Promotional Materials', value: 'promotional-materials' }
                ]
            },
            {
                label: 'Office Supplies',
                value: 'office-supplies',
                items: [
                    { label: 'Stationery', value: 'stationery' },
                    { label: 'Software Subscriptions', value: 'software-subscriptions' }
                ]
            },
            {
                label: 'Travel and Entertainment',
                value: 'travel-entertainment',
                items: [
                    { label: 'Business Travel', value: 'business-travel' },
                    { label: 'Client Entertainment', value: 'client-entertainment' }
                ]
            }
        ]
    },
    {
        label: 'Logistics and Distribution',
        value: 'logistics-distribution',
        items: [
            { label: 'Shipping and Delivery', value: 'shipping-delivery' },
            {
                label: 'Vehicle Expenses',
                value: 'vehicle-expenses',
                items: [
                    { label: 'Fuel', value: 'fuel' },
                    { label: 'Maintenance and Repairs', value: 'maintenance-repairs' },
                    { label: 'Vehicle Leasing', value: 'vehicle-leasing' }
                ]
            }
        ]
    },
    {
        label: 'Insurance',
        value: 'insurance',
        items: [
            { label: 'Property Insurance', value: 'property-insurance' },
            { label: 'Liability Insurance', value: 'liability-insurance' },
            { label: 'Workers\' Compensation', value: 'workers-compensation' },
            { label: 'Vehicle Insurance', value: 'vehicle-insurance' }
        ]
    },
    {
        label: 'Maintenance and Repairs',
        value: 'maintenance-repairs',
        items: [
            { label: 'Building Maintenance', value: 'building-maintenance' },
            { label: 'Equipment Maintenance', value: 'equipment-maintenance' }
        ]
    },
    {
        label: 'Depreciation and Amortization',
        value: 'depreciation-amortization',
        items: [
            { label: 'Depreciation', value: 'depreciation' },
            { label: 'Amortization', value: 'amortization' }
        ]
    },
    {
        label: 'Taxes',
        value: 'taxes',
        items: [
            { label: 'Income Tax', value: 'income-tax' },
            { label: 'Sales Tax', value: 'sales-tax' },
            { label: 'Property Tax', value: 'property-tax' }
        ]
    },
    {
        label: 'Interest and Financial Charges',
        value: 'interest-financial-charges',
        items: [
            { label: 'Loan Interest', value: 'loan-interest' },
            { label: 'Bank Fees', value: 'bank-fees' }
        ]
    },
    {
        label: 'Miscellaneous Expenses',
        value: 'miscellaneous-expenses',
        items: [
            { label: 'Licenses and Permits', value: 'licenses-permits' },
            {
                label: 'Professional Services',
                value: 'professional-services',
                items: [
                    { label: 'Legal Fees', value: 'legal-fees' },
                    { label: 'Accounting Fees', value: 'accounting-fees' }
                ]
            },
            { label: 'Bad Debts', value: 'bad-debts' },
            { label: 'Employee Training', value: 'employee-training' }
        ]
    }
];
