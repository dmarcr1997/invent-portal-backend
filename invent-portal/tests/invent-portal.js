const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);
  const program = anchor.workspace.Myepicproject;

  const baseAccount = anchor.web3.Keypair.generate();

  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  await program.rpc.addGif("https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey
    },
  });
  
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
  console.log('👀 GIF List', account.gifList)
  await program.rpc.addLike("https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  })
  let account2 = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF LIKED:', account2.gifList.find(x => x.gifLink === "https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif"));
  await program.rpc.addLike("https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  })

  let account3 = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF LIKED AGAIN:',account3.gifList.find(x => x.gifLink === "https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif"));

  await program.rpc.removeLike("https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  })

  let account4 = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF DISLIKED:',account4.gifList.find(x => x.gifLink === "https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif"));

  for(let i = 0; i < 11; i++){
    await program.rpc.removeLike("https://media.giphy.com/media/3o6Ztm25ikO467NGOk/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    })
  }
  
  let account5 = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Removed');
  console.log('👀 GIF List', account5.gifList);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();