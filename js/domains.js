const domains = [
    // Cannabis/CBD Category
    { name: 'cannafirm.net', category: 'Cannabis', buyNow: 55000, minOffer: 99 },
    { name: 'cannasnack.com', category: 'Cannabis', buyNow: 55000, minOffer: 9944 },
    { name: 'cannastocks.com', category: 'Cannabis', buyNow: 150000, minOffer: 9999 },
    { name: 'cannatubes.com', category: 'Cannabis', buyNow: 12500, minOffer: 99 },
    { name: 'cbcvoil.com', category: 'Cannabis', buyNow: 50000, minOffer: 99 },
    { name: 'cbeoil.com', category: 'Cannabis', buyNow: 50000, minOffer: 99 },
    { name: 'cbgvoil.com', category: 'Cannabis', buyNow: 90000, minOffer: 99 },
    { name: 'getmarijuana.org', category: 'Cannabis', buyNow: 19000, minOffer: 99 },
    { name: 'marihuanas.org', category: 'Cannabis', buyNow: 90000, minOffer: 9944 },
    { name: 'mexicocitymarijuana.com', category: 'Cannabis', buyNow: 9000, minOffer: 99 },
    { name: 'mexicomarihuana.org', category: 'Cannabis', buyNow: 41200, minOffer: 99 },
    { name: 'thclocate.com', category: 'Cannabis', buyNow: 55000, minOffer: 12000 },

    // Technology Category
    { name: 'adjusts.net', category: 'Technology', buyNow: 15000, minOffer: 99 },
    { name: 'servergamer.com', category: 'Technology', buyNow: 12000, minOffer: 5000 },
    { name: 'gpt-4.com.mx', category: 'Technology', buyNow: 666, minOffer: 99 },
    { name: 'je4.net', category: 'Technology', buyNow: 50009, minOffer: 99 },
    { name: 'noobfree.com', category: 'Technology', buyNow: 1500, minOffer: 99 },
    { name: 'fragfun.com', category: 'Technology', buyNow: 7500, minOffer: 99 },
    {
        name: '01fast.com',
        category: 'Technology',
        buyNow: 2999,
        minOffer: 999,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: '01fast.net',
        category: 'Technology',
        buyNow: 1499,
        minOffer: 499,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: '01fast.online',
        category: 'Technology',
        buyNow: 999,
        minOffer: 299,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: 'cloudstorage.now',
        category: 'Technology',
        buyNow: 4999,
        minOffer: 1999,
        featured: true,
        expiryDate: '2025-10-20'
    },

    // Business Category
    { name: 'budgetairlines.org', category: 'Business', buyNow: 6500, minOffer: 99 },
    { name: 'coauthor.net', category: 'Business', buyNow: 1900, minOffer: 99 },
    { name: 'fund.com.mx', category: 'Business', buyNow: 34444, minOffer: 99 },
    { name: 'homeowneradvocategroup.com', category: 'Business', buyNow: 5000, minOffer: 99 },
    { name: 'smartsolar.us', category: 'Business', buyNow: 90000, minOffer: 994 },
    { name: 'welobbyit.com', category: 'Business', buyNow: 30000, minOffer: 99 },
    { name: 'bulkquartz.com', category: 'Business', buyNow: 9555, minOffer: 900 },
    { name: 'masmart.org', category: 'Business', buyNow: 5000, minOffer: 2900 },
    { name: 'privacies.net', category: 'Business', buyNow: 15000, minOffer: 99 },
    { name: 'proleggings.com', category: 'Business', buyNow: 7600, minOffer: 99 },
    { name: 'tankcontainer.org', category: 'Business', buyNow: 5500, minOffer: 99 },
    {
        name: 'awakens.org',
        category: 'Business',
        buyNow: 1999,
        minOffer: 799,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: 'countermen.com',
        category: 'Business',
        buyNow: 2499,
        minOffer: 999,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: 'creditrepair.now',
        category: 'Business',
        buyNow: 7999,
        minOffer: 2999,
        featured: true,
        expiryDate: '2025-10-20'
    },
    {
        name: 'exterminated.net',
        category: 'Business',
        buyNow: 1499,
        minOffer: 499,
        featured: false,
        expiryDate: '2025-10-19'
    },
    {
        name: 'guiltily.com',
        category: 'Business',
        buyNow: 1999,
        minOffer: 799,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: 'interprets.net',
        category: 'Business',
        buyNow: 1999,
        minOffer: 799,
        featured: false,
        expiryDate: '2025-10-30'
    },
    {
        name: 'midsts.com',
        category: 'Business',
        buyNow: 1499,
        minOffer: 499,
        featured: false,
        expiryDate: '2025-10-19'
    },
    {
        name: 'natured.net',
        category: 'Business',
        buyNow: 1999,
        minOffer: 799,
        featured: false,
        expiryDate: '2025-10-30'
    },
    {
        name: 'stayed.net',
        category: 'Business',
        buyNow: 1499,
        minOffer: 499,
        featured: false,
        expiryDate: '2025-10-30'
    },
    {
        name: 'stimulations.org',
        category: 'Business',
        buyNow: 2499,
        minOffer: 999,
        featured: false,
        expiryDate: '2025-10-19'
    },
    {
        name: 'vocabularies.org',
        category: 'Business',
        buyNow: 2999,
        minOffer: 999,
        featured: false,
        expiryDate: '2025-10-13'
    },
    {
        name: 'wintry.net',
        category: 'Business',
        buyNow: 1499,
        minOffer: 499,
        featured: false,
        expiryDate: '2025-10-13'
    },

    // Domains Category
    { name: 'adoptive.net', category: 'Domains', buyNow: 12000, minOffer: 99 },
    { name: 'adopts.net', category: 'Domains', buyNow: 75000, minOffer: 99 },
    { name: 'amain.org', category: 'Domains', buyNow: 6000, minOffer: 99 },
    { name: 'awaits.net', category: 'Domains', buyNow: 2000, minOffer: 99 },
    { name: 'awakes.net', category: 'Domains', buyNow: 17000, minOffer: 9900 },
    { name: 'burglarizes.com', category: 'Domains', buyNow: 7666, minOffer: 99 },
    { name: 'catsru.com', category: 'Domains', buyNow: 3800, minOffer: 800 },
    { name: 'dislikes.org', category: 'Domains', buyNow: 5000, minOffer: 99 },
    { name: 'leapt.org', category: 'Domains', buyNow: 2444, minOffer: 99 },
    { name: 'levies.net', category: 'Domains', buyNow: 2400, minOffer: 99 },
    { name: 'lucked.net', category: 'Domains', buyNow: 77777, minOffer: 99 },
    { name: 'maintenances.org', category: 'Domains', buyNow: 7000, minOffer: 99 },
    { name: 'survives.net', category: 'Domains', buyNow: 46000, minOffer: 99 },

    // Geographic Category
    { name: 'cola.mx', category: 'Geographic', buyNow: 150000, minOffer: 9999 },
    { name: 'politica.net', category: 'Geographic', buyNow: 75000, minOffer: 15000 },
    { name: 'xn--poltica-9ya.net', category: 'Geographic', buyNow: 65000, minOffer: 99 },

    // Personal Category
    { name: 'ryanmcginley.net', category: 'Personal', buyNow: null, minOffer: 99 },
    
    // Adult Category
    { name: 'wickedgay.com', category: 'Adult', buyNow: 7500, minOffer: 2900 }
];

export default domains;
