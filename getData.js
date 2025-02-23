import getUserProfileWithStats from "./scraper.js";

async function fetchUsernames() {
  let response = await fetch("https://lsbackend-azqh.onrender.com/users");
  let data = await response.json(); 
  
  let usernames = data.map(element => element.username);

  return usernames;
}

async function fetchDetails() {
  let usernames = await fetchUsernames(); 
  
  let results = await Promise.all(usernames.map(async (item) => await getUserProfileWithStats(item)));

  results.sort((a, b) => b.points - a.points);
  console.log(results);
  return results;
}

export default fetchDetails;
