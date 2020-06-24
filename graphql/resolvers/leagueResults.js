const LeagueResult = require('../../models/LeagueResults');

const { runInTransaction, checkTeam, transformResultData, deleteLeagueResultData, checkLeagueResult } = require('./merge');

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
        if (leagueResultInput.homeTeam === leagueResultInput.awayTeam) {
            throw new Error('Please select two seperate teams.')
        };

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

                if (leagueResultInput.homeScore > leagueResultInput.awayScore) {
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
    },
    deleteLeagueResult: async ({resultId}) => {
        const leagueResult = await checkLeagueResult(resultId);
        // console.log(leagueResult)
        const homeTeam = await checkTeam(leagueResult.homeTeam);
        // console.log(homeTeam);
        const awayTeam = await checkTeam(leagueResult.awayTeam);
        // console.log(awayTeam);

        let deletedResult;
        try {
            await runInTransaction(async session => {
                await LeagueResult.findByIdAndDelete(resultId);

                homeTeam.gamesPlayed -= 1;
                awayTeam.gamesPlayed -= 1;

                if (leagueResult.homeScore > leagueResult.awayScore) {
                    homeTeam.gamesWon -= 1;
                    homeTeam.points -= 3;
                    awayTeam.gamesLost -= 1;
                } else if (leagueResult.homeScore === leagueResult.awayScore) {
                    homeTeam.gamesDraw -= 1;
                    homeTeam.points -= 1;
                    awayTeam.gamesDraw -= 1;
                    awayTeam.points -= 1;
                } else {
                    homeTeam.gamesLost -= 1;
                    awayTeam.gamesWon -= 1;
                    awayTeam.points -= 3;
                };

                homeTeam.goalsScored -= leagueResult.homeScore;
                homeTeam.goalsAgainst -= leagueResult.awayScore;
                homeTeam.goalDifference -= (leagueResult.homeScore - leagueResult.awayScore);
                awayTeam.goalsScored -= leagueResult.awayScore;
                awayTeam.goalsAgainst -= leagueResult.homeScore;
                awayTeam.goalDifference -= (leagueResult.awayScore - leagueResult.homeScore);

                const homeTeamIndex = homeTeam.leagueResults.indexOf(leagueResult._id);
                console.log(homeTeamIndex);
                homeTeam.leagueResults.splice(homeTeamIndex, 1);

                const awayTeamIndex = awayTeam.leagueResults.indexOf(leagueResult._id);
                console.log(awayTeamIndex);
                awayTeam.leagueResults.splice(awayTeamIndex, 1);

                await homeTeam.save({session: session});
                await awayTeam.save({session: session});

                deletedResult = transformResultData(leagueResult);
            })
            return deletedResult;
        } catch (err) {
            throw err;
        }
    }
};

