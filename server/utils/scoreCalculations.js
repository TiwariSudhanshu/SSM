const calculatePortfolioMetrics = (user, companies, allUsers) => {
    // Calculate Average ESG Score
    let totalESGScore = 0;
    let totalShares = 0;
    
    user.holdings.forEach(holding => {
        const company = companies.find(c => c._id.toString() === holding.company.toString());
        if (company) {
            totalESGScore += holding.shares * company.esgScore;
            totalShares += holding.shares;
        }
    });
    
    const avgESGScore = totalShares > 0 ? totalESGScore / totalShares : 0;

    // Calculate Portfolio Value
    // Portfolio Value is the sum of cashBalance and the value of holdings
    let portfolioValue = user.balance || 0; // Start with balance
    user.holdings.forEach(holding => {
        const company = companies.find(c => c._id.toString() === holding.company.toString());
        if (company) {
            portfolioValue += holding.shares * company.stockPrice; // Add value of holdings
        }
    });

    // Calculate Normalized Value
    const highestTeamValue = Math.max(...allUsers.map(u => u.portfolioValue || 0));
    const normalizedValue = highestTeamValue > 0 ? (portfolioValue / highestTeamValue) * 100 : 0;

    // Calculate Sector Distribution Score
    const sectorDistribution = {};
    let totalSectorShares = 0;
    
    user.holdings.forEach(holding => {
        const company = companies.find(c => c._id.toString() === holding.company.toString());
        if (company) {
            sectorDistribution[company.sector] = (sectorDistribution[company.sector] || 0) + holding.shares;
            totalSectorShares += holding.shares;
        }
    });

    // Calculate sector diversity score (higher score for more diverse portfolio)
    const sectorScore = totalSectorShares > 0 
        ? Object.values(sectorDistribution).reduce((score, shares) => {
            const proportion = shares / totalSectorShares;
            return score - (proportion * Math.log(proportion));
        }, 0) * 100
        : 0;

    // Calculate Final Score
    const finalScore = (
        (normalizedValue * 0.4) + // Portfolio Value Score
        (avgESGScore * 0.4) +     // ESG Score
        (sectorScore * 0.2)       // Sector Score
    );

    return {
        avgESGScore,
        portfolioValue,
        normalizedValue,
        sectorScore,
        finalScore,
        sectorDistribution
    };
};

module.exports = {
    calculatePortfolioMetrics
}; 