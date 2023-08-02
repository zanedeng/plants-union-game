// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract LevelConfig {

    /// @dev 玩家升级的数据结构体
    struct LevelCfg {
        uint256 level; // 对应的等级
        uint256[] prizes; // 奖励的物品
        uint256 gold; // 奖励的金币
        uint256 levelup_exp; // 升级所需要的经验值
        uint256 total_exp; // 累计总经验值
        uint8 hunting_num; // 对应的狩猎次数
        uint8 garden_plant_num; // 花园的植物数量
        uint8 public_place_num; // 好友地的数量
        uint8 war_grid_num; // 可以开启的战斗位数量
    }

    mapping(uint256 => LevelCfg) private levels;

    /// @dev 解析玩家升级的等级配置表
    function parseConfig(LevelCfg[] memory config) public {
        for (uint i = 0; i < config.length; i++) {
            LevelCfg memory cfg = config[i];
            levels[cfg.level] = cfg;
        }
    }

    /// @dev 根据指定的等级获取相应的配置信息
    function getLevelCfg(uint256 level) public view returns(LevelCfg memory) {
        return levels[level];
    }
}
