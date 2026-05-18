export interface Product {
    id: string;
    shopifyId?: string;
    shopifyVariants?: Array<{
        id: string;
        title: string;
        price: string;
        available: boolean;
    }>;
    name: string;
    title: string;
    description: string;
    price: string;
    originalPrice?: string;
    traceability: {
        source: string;
        tasteNotes: string[];
        process: string;
        elevation: string;
    };
    heroImage: string;
    heroImageMobile: string;
    productCardImage: string;
    galleryImages: string[];
    descriptionContent: {
        title: string;
        content: string;
        image: string;
    };
    category: string;
    featured?: boolean;
    upcoming?: boolean;
}

export const products: Product[] = [
    {
        id: 'movement',
        shopifyId: 'gid://shopify/Product/9859123511578',
        shopifyVariants: [
        { id: 'gid://shopify/ProductVariant/50617988055322', title: 'Default Title', price: '7499.0', available: true }
    ],
        name: 'MOVEMENT',
        title: 'Movement',
        description: 'Revolutionizing Coffee, One Adventure at a Time.',
        price: 'INR 7,499.00',
        traceability: {
            source: 'N/A',
            tasteNotes: [],
            process: 'N/A',
            elevation: 'N/A'
        },
        heroImage: '', // Placeholder
        heroImageMobile: '', // Placeholder
        productCardImage: '', // Placeholder
        galleryImages: [],
        descriptionContent: {
            title: 'Revolutionizing Coffee',
            content: 'Revolutionizing Coffee, One Adventure at a Time.',
            image: '' // Placeholder
        },
        category: 'signature-blends', // Default category
        featured: false
    }
];