import axios from "axios";

async function getUserStats(username) {
    const url = "https://leetcode.com/graphql";
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    };

    const query = `
    query getUserProfileWithStats($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          aboutMe
          reputation
          solutionCount
          postViewCount
          ranking
          countryName
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
    `;

    const payload = {
        query: query,
        variables: { username: username }
    };

    try {
        const response = await axios.post(url, payload, { headers: headers });
        const data = response.data;

        // Ensure submitStats exists before accessing array
        const results = data?.data?.matchedUser?.submitStats?.acSubmissionNum;
        
        if (!results || results.length < 4) {
            return null
        }

        const solved = {
          username : username,
          image : data?.data?.matchedUser?.profile.userAvatar,
          all: results[0].count, 
          easy: results[1].count,
          medium: results[2].count,
          hard: results[3].count,
          points: results[1].count * 1 + results[2].count * 2 + results[3].count * 3
        };

        return solved;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}
export default getUserStats;

