const LeagueResult = require('../../models/LeagueResults');

const { runInTransaction, checkTeam, transformResultData } = require('./merge');

module.exports = {
    leagueResults: async () => {
        try {
            const leagueResults = await LeagueResult.find();
            return leagueResults.map(leagueResult => {
                return transformResultData(leagueResult);
            });
        } catch (err) {
            throw err;
        };
    },
    createLeagueResult: async ({leagueResultInput}) => {
        const homeTeam = await checkTeam(leagueResultInput.homeTeam);
        const awayTeam = await checkTeam(leagueResultInput.awayTeam);

        const result = new LeagueResult({
            homeTeam: leagueResultInput.homeTeam,
            homeScore: leagueResultInput.homeScore,
            awayTeam: leagueResultInput.awayTeam,
            awayScore: leagueResultInput.awayScore,
            date: new Date(leagueResultInput.date)
        });

        let createdResult;
        try {
            await runInTransaction(async session => {
                const savedResult = await result.save({session: session});

                homeTeam.gamesPlayed += 1;
                awayTeam.gamesPlayed += 1;

                if(leagueResultInput.homeScore > leagueResultInput.awayScore) {
                    homeTeam.gamesWon += 1;
                    homeTeam.points += 3;
                    awayTeam.gamesLost += 1;
                } else if (leagueResultInput.homeScore === leagueResultInput.awayScore) {
                    homeTeam.gamesDraw += 1;
                    homeTeam.points += 1;
                    awayTeam.gamesDraw += 1;
                    awayTeam.points += 1;
                } else {
                    homeTeam.gamesLost += 1;
                    awayTeam.gamesWon += 1;
                    awayTeam.points += 3;
                };

                homeTeam.goalsScored += leagueResultInput.homeScore;
                homeTeam.goalsAgainst += leagueResultInput.awayScore;
                homeTeam.goalDifference += (leagueResultInput.homeScore - leagueResultInput.awayScore);
                awayTeam.goalsScored += leagueResultInput.awayScore;
                awayTeam.goalsAgainst += leagueResultInput.homeScore;
                awayTeam.goalDifference += (leagueResultInput.awayScore - leagueResultInput.homeScore);

                homeTeam.leagueResults.push(result);
                awayTeam.leagueResults.push(result);

                await homeTeam.save({session: session});
                await awayTeam.save({session: session});
                createdResult = transformResultData(savedResult);
            });
            return createdResult;
        } catch (err) {
            throw err;
        };
    }
};

