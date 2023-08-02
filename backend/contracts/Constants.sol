// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Constants {
  // 创建角色时，角色名称为空
  uint256 public constant ERROR_CODE_101 = 101;
  // 创建角色时，角色已存在
  uint256 public constant ERROR_CODE_102 = 102;
  // 创建角色时，玩家已经有角色了
  uint256 public constant ERROR_CODE_103 = 103;
}
