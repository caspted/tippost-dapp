// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract TipPost {
  
  struct Post {
    uint256 id;
    address creator;
    string imageUrl;
    string caption;
    uint256 likes;
    uint256 totalEarned;
    uint256 timestamp;
  }

  uint256 public postcount = 0;
  uint256 public constant likeCost = 0.0001 ether;

  mapping(uint256 => Post) public posts;
  mapping(uint256 => mapping(address => bool)) public hasLiked;
  mapping(address => uint256) public totalEarnedByUser;

  event PostCreated(uint256 indexed id, address indexed creator, string imageUrl, string caption);
  event PostLiked(uint256 indexed id, address indexed linker, uint256 amount);

  function createPost(string memory _imageUrl, string memory _caption) public {
    require(bytes(_imageUrl).length > 0, "Image URL is required");
    require(bytes(_caption).length > 0, "Caption is required");

    postcount++;

    posts[postcount] = Post(
      postcount,
      msg.sender,
      _imageUrl,
      _caption,
      0,
      0,
      block.timestamp
    );

    emit PostCreated(postcount, msg.sender, _imageUrl, _caption);
  }

  function likePost(uint256 _id) public payable {
      require(_id > 0 && _id <= postcount, "Post does not exist");
      require(msg.value == likeCost, "Must send exactly 0.0001 ETH");
      require(!hasLiked[_id][msg.sender], "Already liked this post");
      require(msg.sender != posts[_id].creator, "Cannot like your own post");

      Post storage post = posts[_id];
      
      post.likes++;
      post.totalEarned += msg.value;
      hasLiked[_id][msg.sender] = true;
      totalEarnedByUser[post.creator] += msg.value;

      (bool success, ) = post.creator.call{value: msg.value}("");
      require(success, "Transfer failed");

      emit PostLiked(_id, msg.sender, msg.value);
  }

  function getAllPosts() public view returns (Post[] memory) {
      Post[] memory allPosts = new Post[] (postcount);
      for (uint256 i = 1; i <= postcount; i++) {
          allPosts[i - 1] = posts[i];
      }
      return allPosts;
  }

  function checkLiked(uint256 _id, address _user) public view returns (bool) {
      return hasLiked[_id][_user];
  }

}