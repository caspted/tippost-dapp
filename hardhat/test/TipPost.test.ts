import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther, type Address } from "viem";

type PostTuple = [bigint, Address, string, string, bigint, bigint, bigint];

describe("TipPost", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1, user2] = await viem.getWalletClients();

  it("Should create a post and store data correctly", async function () {
    const tipPost = await viem.deployContract("TipPost");

    const txHash = await tipPost.write.createPost([
      "https://test.com/img.png",
      "Hello Blockchain!",
    ]);
    await publicClient.waitForTransactionReceipt({ hash: txHash });


    const post = await tipPost.read.posts([1n]) as PostTuple;
    assert.equal(post[3], "Hello Blockchain!");
    assert.equal(post[1].toLowerCase(), owner.account.address.toLowerCase());
  });

  it("Should allow liking and transfer ETH to the creator", async function () {
    const tipPost = await viem.deployContract("TipPost");

    const createHash = await tipPost.write.createPost(["url", "caption"], {
      account: user1.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: createHash });

    const initialBalance = await publicClient.getBalance({
      address: user1.account.address,
    });
    const likeAmount = parseEther("0.0001");

    const likeHash = await tipPost.write.likePost([1n], {
      account: user2.account,
      value: likeAmount,
    });
    await publicClient.waitForTransactionReceipt({ hash: likeHash });

    const finalBalance = await publicClient.getBalance({
      address: user1.account.address,
    });
    assert.equal(finalBalance, initialBalance + likeAmount);
  });

  it("Should reject if a user tries to like the same post twice", async function () {
    const tipPost = await viem.deployContract("TipPost");

    await publicClient.waitForTransactionReceipt({
      hash: await tipPost.write.createPost(["url", "caption"], {
        account: user1.account,
      }),
    });

    const likeAmount = parseEther("0.0001");

    await publicClient.waitForTransactionReceipt({
      hash: await tipPost.write.likePost([1n], {
        account: user2.account,
        value: likeAmount,
      }),
    });

    await assert.rejects(
      tipPost.write.likePost([1n], {
        account: user2.account,
        value: likeAmount,
      }),
      /Already liked this post/,
    );
  });

  it("Should reject if the creator tries to like their own post", async function () {
    const tipPost = await viem.deployContract("TipPost");

    await publicClient.waitForTransactionReceipt({
      hash: await tipPost.write.createPost(["url", "caption"], {
        account: user1.account,
      }),
    });

    const likeAmount = parseEther("0.0001");

    await assert.rejects(
      tipPost.write.likePost([1n], {
        account: user1.account,
        value: likeAmount,
      }),
      /Cannot like your own post/,
    );
  });
});