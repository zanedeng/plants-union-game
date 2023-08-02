// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../Constants.sol";

contract RoleInfo {

  event RoleCreated(address indexed user, string roleName, uint8 avatarId);

  struct Role {
    // 角色名称
    string name;
    // 角色图像ID
    uint8 avatarId;
    // 角色等级
    uint32 level;
    // 战斗格子数量
    uint8 warGridNum;
    // 金币数量
    uint256 gold;
    // 创建时间
    uint256 createTime;
    // 角色的所有者
    address owner;
  }

  Role[] private allRoles;
  mapping(address => Role) private roles;
  mapping(string => uint256) private roleIndex;

  /**
   * 创建角色
   * 当用户调用此函数时，它将检查角色名称是否为空、角色是否已经存在以及用户是否已经有一个角色。
   * 如果这些条件均满足，则创建一个新角色，并将其添加到映射和 allRoles 数组中。
   */
  function createRole(string memory _name, uint8 _avatarId) public returns (uint256) {
    if (bytes(_name).length == 0) {
      return Constants.ERROR_CODE_101;
    }

    if (roleExists(_name)) {
      return Constants.ERROR_CODE_102;
    }

    if (bytes(roles[msg.sender].name).length > 0) {
      return Constants.ERROR_CODE_103;
    }

    Role memory newRole = Role(
      _name,
      _avatarId,
      1,
      2,
      30000,
      block.timestamp,
      msg.sender
    );
    roles[msg.sender] = newRole;
    uint256 index = allRoles.length;
    roleIndex[_name] = index;
    allRoles.push(newRole);

    emit RoleCreated(msg.sender, _name, _avatarId);

    return 0;
  }

  /**
   * 获取用户的角色，返回当前用户的角色信息
   */
  function getRole() public view returns (string memory, uint8, uint32, uint8, uint256, uint256) {
    Role memory role = roles[msg.sender];
    return (
      role.name,
      role.avatarId,
      role.level,
      role.warGridNum,
      role.gold,
      role.createTime
    );
  }

  /**
   * 通过角色名称去获取合约中的角色信息
   */
  function getRoleByName(string memory _name) public view returns (string memory, uint8, uint32, uint8, uint256, uint256, address) {
    if (roleExists(_name)) {
      uint256 index = roleIndex[_name];
      Role memory role = allRoles[index];
      return (
        role.name,
        role.avatarId,
        role.level,
        role.warGridNum,
        role.gold,
        role.createTime,
        role.owner
      );
    }
    return ('', 0, 0, 0, 0, 0, address(0));
  }

  function roleExists(string memory _name) public view returns (bool) {
    if (roleIndex[_name] == 0) {
      return allRoles.length > 0;
    }
    return true;
  }
}
