//GitHub API Library
const { Octokit } = require('@octokit/rest');

//Insert your GitHub tokens here in next format ['token1', 'token2', 'token3']
const gitTokens = ['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', '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','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','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','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','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','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','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','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','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','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']

//Insert your GitHub names here in next format ['name1', 'name2', 'name3']
const gitNames = ['Alexnstep', 'San-Du5', 'Mystry22a', 'RobertPark1', 'ThomasMoo21', 'JosephGonza123', 'Steveee333', 'PaulH31', 'Markhesz21', 'Davidos1s', 'DavidM331']



//Function to generate unique name for the file
function generateUniqueName() {
    return `fact_${Math.floor(Math.random() * 150000000)}.txt`;
}


//Function to push random cat fact to the GitHub repo
async function pushRandomCatName(repoOwner, token) {
    //API initialization
    const octokit = new Octokit({ auth: token });

    try {

        //Get all files from the repo
        const branchFilesData = await octokit.rest.repos.getContent({
            owner: repoOwner,
            repo: 'randomCatFacts',
            branch: 'main',
        });

        console.log(branchFilesData, 'branchFilesData')

        //Get random cat fact
        const catsResponse = await fetch("https://catfact.ninja/fact");
        const { fact } = await catsResponse.json();

        //Generate unique name for the file
        let randomName = generateUniqueName();

        //Check if file name is unique in the repo
        const isAlreadyFileNameExist = !!branchFilesData.data.find((user) => {
            return user.path === randomName;
        });

        //If file name is not unique, generate new name
        if (isAlreadyFileNameExist) {
            pushRandomCatName(repoOwner, token);
        }

        // Push file to the repo
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: 'randomCatFacts',
            path: randomName,
            message: 'Another great day with great cat fact',
            content: Buffer.from(fact).toString('base64'),
            branch: 'main',
        });
        console.log('Pushed fact to randomCatFacts');
    } catch (error) {
        console.error('Error pushing fact to randomCatFacts', error);
    }
}

//Function to start execution
function startExecution() {
    gitTokens.forEach((token, index) => {
        pushRandomCatName(gitNames[index], token);
    })
}

//Start execution
startExecution();
