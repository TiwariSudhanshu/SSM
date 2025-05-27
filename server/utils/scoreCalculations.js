const calculatePortfolioMetrics = (user, companies, allUsers) => {
    // Helper function to calculate metrics for a user
    const calculateUserMetrics = (u) => {
        let totalESGScore = 0;
        let totalShares = 0;
        const sectorDistribution = {};
        let totalSectorShares = 0;

        u.holdings.forEach(holding => {
            const company = companies.find(c => c._id.toString() === holding.company.toString());
            if (company) {
                totalESGScore += holding.shares * company.esgScore;
                totalShares += holding.shares;

                sectorDistribution[company.sector] = (sectorDistribution[company.sector] || 0) + holding.shares;
                totalSectorShares += holding.shares;
            }
        });

        const avgESGScore = totalShares > 0 ? totalESGScore / totalShares : 0;

        const sectorCount = Object.keys(sectorDistribution).length;
        const maxEntropy = sectorCount > 1 ? Math.log(sectorCount) : 1;

        const sectorScore = totalSectorShares > 0 && sectorCount > 0
            ? Object.values(sectorDistribution).reduce((score, shares) => {
                const proportion = shares / totalSectorShares;
                return score - (proportion * Math.log(proportion));
            }, 0) / maxEntropy * 100
            : 0;

        let portfolioValue = u.balance || 0;
        u.holdings.forEach(holding => {
            const company = companies.find(c => c._id.toString() === holding.company.toString());
            if (company) {
                portfolioValue += holding.shares * company.stockPrice;
            }
        });

        return {
            avgESGScore,
            sectorScore,
            portfolioValue,
            sectorDistribution
        };
    };

    // Calculate and assign metrics for all users (needed for normalization)
    allUsers.forEach(u => {
        const metrics = calculateUserMetrics(u);
        u.avgESGScore = metrics.avgESGScore;
        u.sectorScore = metrics.sectorScore;
        u.portfolioValue = metrics.portfolioValue;
        u.sectorDistribution = metrics.sectorDistribution;
    });

    // Calculate current user's metrics (for return)
    const userMetrics = calculateUserMetrics(user);

    // Get max values for normalization from all users
    const highestTeamValue = Math.max(...allUsers.map(u => u.portfolioValue || 0));
    const maxESGScore = Math.max(...allUsers.map(u => u.avgESGScore || 0));
    const maxSectorScore = Math.max(...allUsers.map(u => u.sectorScore || 0));

    // Normalize values for current user
    const normalizedValue = highestTeamValue > 0 ? (userMetrics.portfolioValue / highestTeamValue) * 100 : 0;
    const normalizedESG = maxESGScore > 0 ? (userMetrics.avgESGScore / maxESGScore) * 100 : 0;
    const normalizedSectorScore = maxSectorScore > 0 ? (userMetrics.sectorScore / maxSectorScore) * 100 : 0;

    // Calculate final score (weighted)
    const finalScore = (
        (normalizedValue * 0.4) +
        (normalizedESG * 0.4) +
        (normalizedSectorScore * 0.2)
    );

    // Return detailed results for the current user
    return {
        avgESGScore: userMetrics.avgESGScore,
        portfolioValue: userMetrics.portfolioValue,
        normalizedValue,
        sectorScore: userMetrics.sectorScore,
        normalizedESG,
        normalizedSectorScore,
        finalScore,
        sectorDistribution: userMetrics.sectorDistribution
    };
};

module.exports = {
    calculatePortfolioMetrics
};
