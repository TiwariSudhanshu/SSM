const calculatePortfolioMetrics = (user, companies, allUsers) => {
    // Calculate Average ESG Score
    let totalESGScore = 0;
    let totalShares = 0;

    user.holdings.forEach(holding => {
        const company = companies.find(c => c._id.toString() === holding.company.toString());
        if (company) {
            // Convert ESG score to percentage (1-10 scale to 0-100 scale for calculations)
            const esgPercentage = (company.esgScore / 10) * 100;
            totalESGScore += holding.shares * esgPercentage;
            totalShares += holding.shares;
        }
    });

    const avgESGScore = totalShares > 0 ? totalESGScore / totalShares : 0;

    // Calculate Portfolio Value
    let portfolioValue = user.balance || 0;
    user.holdings.forEach(holding => {
        const company = companies.find(c => c._id.toString() === holding.company.toString());
        if (company) {
            portfolioValue += holding.shares * company.stockPrice;
        }
    });

    // Store portfolioValue in user object to use for normalization
    user.portfolioValue = portfolioValue;

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
const sectorCount = Object.keys(sectorDistribution).length;
const maxEntropy = sectorCount > 1 ? Math.log(sectorCount) : 1;

const sectorScore = totalSectorShares > 0 && sectorCount > 0
    ? Object.values(sectorDistribution).reduce((score, shares) => {
        const proportion = shares / totalSectorShares;
        return score - (proportion * Math.log(proportion));
    }, 0) / maxEntropy * 100
    : 0;
   

    // Get max values for normalization
    const highestTeamValue = Math.max(...allUsers.map(u => u.portfolioValue || 0));
    const maxESGScore = Math.max(...allUsers.map(u => u.avgESGScore || 0));
    const maxSectorScore = Math.max(...allUsers.map(u => u.sectorScore || 0));

    // Normalize values
    const normalizedValue = highestTeamValue > 0 ? (portfolioValue / highestTeamValue) * 100 : 0;
    const normalizedESG = maxESGScore > 0 ? (avgESGScore / maxESGScore) * 100 : 0;
    const normalizedSectorScore = maxSectorScore > 0 ? (sectorScore / maxSectorScore) * 100 : 0;

    // Final Score using normalized values
    const finalScore = (
        (normalizedValue * 0.4) +
        (normalizedESG * 0.4) +
        (normalizedSectorScore * 0.2)
    );

    return {
        avgESGScore,
        portfolioValue,
        normalizedValue,
        sectorScore,
        normalizedESG,
        normalizedSectorScore,
        finalScore,
        sectorDistribution
    };
};
module.exports = {
    calculatePortfolioMetrics
};