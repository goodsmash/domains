const domains = [
    {
        name: '01fast.com',
        price: 8628,
        category: 'general',
        featured: false
    },
    {
        name: 'adjusts.net',
        price: 15000,
        category: 'general',
        featured: false
    },
    {
        name: 'adoptive.net',
        price: 12000,
        category: 'general',
        featured: false
    },
    {
        name: 'adopts.net',
        price: 75000,
        category: 'general',
        featured: true
    },
    {
        name: 'amain.org',
        price: 6000,
        category: 'general',
        featured: false
    },
    {
        name: 'awaits.net',
        price: 2000,
        category: 'general',
        featured: false
    },
    {
        name: 'awakens.org',
        price: 7500,
        category: 'general',
        featured: false
    },
    {
        name: 'awakes.net',
        price: 17000,
        category: 'general',
        featured: false
    },
    {
        name: 'budgetairlines.org',
        price: 6500,
        category: 'travel',
        featured: false
    },
    {
        name: 'bulkquartz.com',
        price: 9555,
        category: 'business',
        featured: false
    },
    {
        name: 'burglarizes.com',
        price: 7666,
        category: 'general',
        featured: false
    },
    {
        name: 'cannafirm.net',
        price: 55000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'cannasnack.com',
        price: 55000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'cannastocks.com',
        price: 150000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'cannatubes.com',
        price: 12500,
        category: 'cannabis',
        featured: false
    },
    {
        name: 'catsru.com',
        price: 3800,
        category: 'pets',
        featured: false
    },
    {
        name: 'cbcvoil.com',
        price: 50000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'cbeoil.com',
        price: 50000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'cbgvoil.com',
        price: 90000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'coauthor.net',
        price: 1900,
        category: 'writing',
        featured: false
    },
    {
        name: 'cola.mx',
        price: 150000,
        category: 'beverages',
        featured: true
    },
    {
        name: 'countermen.com',
        price: 25000,
        category: 'general',
        featured: false
    },
    {
        name: 'dislikes.org',
        price: 5000,
        category: 'social',
        featured: false
    },
    {
        name: 'fragfun.com',
        price: 7500,
        category: 'gaming',
        featured: false
    },
    {
        name: 'fund.com.mx',
        price: 34444,
        category: 'finance',
        featured: true
    },
    {
        name: 'getmarijuana.org',
        price: 19000,
        category: 'cannabis',
        featured: false
    },
    {
        name: 'gpt-4.com.mx',
        price: 666,
        category: 'tech',
        featured: true
    },
    {
        name: 'guiltily.com',
        price: 8890,
        category: 'general',
        featured: false
    },
    {
        name: 'homeowneradvocategroup.com',
        price: 5000,
        category: 'real-estate',
        featured: false
    },
    {
        name: 'je4.net',
        price: 50009,
        category: 'general',
        featured: false
    },
    {
        name: 'leapt.org',
        price: 2444,
        category: 'general',
        featured: false
    },
    {
        name: 'levies.net',
        price: 2400,
        category: 'finance',
        featured: false
    },
    {
        name: 'lucked.net',
        price: 77777,
        category: 'general',
        featured: false
    },
    {
        name: 'maintenances.org',
        price: 7000,
        category: 'services',
        featured: false
    },
    {
        name: 'marihuanas.org',
        price: 90000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'masmart.org',
        price: 5000,
        category: 'business',
        featured: false
    },
    {
        name: 'mexicocitymarijuana.com',
        price: 9000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'mexicomarihuana.org',
        price: 41200,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'midsts.com',
        price: 67000,
        category: 'general',
        featured: false
    },
    {
        name: 'noobfree.com',
        price: 1500,
        category: 'gaming',
        featured: false
    },
    {
        name: 'politica.net',
        price: 75000,
        category: 'politics',
        featured: true
    },
    {
        name: 'privacies.net',
        price: 15000,
        category: 'tech',
        featured: false
    },
    {
        name: 'proleggings.com',
        price: 7600,
        category: 'fashion',
        featured: false
    },
    {
        name: 'servergamer.com',
        price: 12000,
        category: 'gaming',
        featured: true
    },
    {
        name: 'smartsolar.us',
        price: 90000,
        category: 'energy',
        featured: true
    },
    {
        name: 'survives.net',
        price: 46000,
        category: 'general',
        featured: false
    },
    {
        name: 'tankcontainer.org',
        price: 5500,
        category: 'industrial',
        featured: false
    },
    {
        name: 'thclocate.com',
        price: 55000,
        category: 'cannabis',
        featured: true
    },
    {
        name: 'vocabularies.org',
        price: 8900,
        category: 'education',
        featured: false
    },
    {
        name: 'welobbyit.com',
        price: 30000,
        category: 'business',
        featured: true
    },
    {
        name: 'wickedgay.com',
        price: 7500,
        category: 'lgbt',
        featured: false
    },
    {
        name: 'wined.net',
        price: 15000,
        category: 'beverages',
        featured: false
    },
    {
        name: 'wintry.net',
        price: 18000,
        category: 'general',
        featured: false
    },
    {
        name: 'xn--poltica-9ya.net',
        price: 65000,
        category: 'politics',
        featured: true
    }
];

// Export for use in other files
window.DOMAIN_DATA = domains;
