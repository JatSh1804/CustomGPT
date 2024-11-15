export const tiers = [
    {
        name: "Free",
        price: "0 APT",
        token:10,
        description: "Basic access to our platform",
        features: [
            "10 tokens per month",
            "Standard support",
            "1 concurrent project",
        ],
        notIncluded: [
            "Advanced models",
            "Priority support",
        ],
        buttonText: "Get Started",
        popular: false,
    },
    {
        name: "Plus",
        token:200,
        price: "🪙1 APT",
        description: "Enhanced features for individuals",
        features: [
            "200 tokens per month",
            "Access to advanced models",
            "Priority email support",
            "5 concurrent projects",
            "Custom API access",
        ],
        notIncluded: [
            "Dedicated account manager",
            "Custom model fine-tuning",
        ],
        buttonText: "Upgrade to Plus",
        popular: true,
    },
    {
        name: "Pro",
        token:500,

        price: "🪙5 APT",
        description: "Premium features for power users",
        features: [
            "500 tokens per month",
            "Access to all models",
            "24/7 priority support",
            "Unlimited concurrent projects",
            "Custom API access",
            "Dedicated account manager",
            "Custom model fine-tuning",
        ],
        notIncluded: [],
        buttonText: "Upgrade to Pro",
        popular: false,
    },
]
