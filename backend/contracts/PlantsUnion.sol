// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./modules/RoleInfo.sol";
import "./config/LevelConfig.sol";

contract PlantsUnion is Ownable, RoleInfo {

  LevelConfig lvCfg = new LevelConfig();

  /// @notice 设置玩家升级的等级配置表
  /// @dev 是否允许多次设置呢，有待商榷!!!
  function setLevelConfig(LevelConfig.LevelCfg[] memory config) public onlyOwner() {
    lvCfg.parseConfig(config);
  }
}
