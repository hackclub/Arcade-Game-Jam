using System.Collections.Generic;
using MyUtils.Structs;
using UnityEngine;


[CreateAssetMenu(menuName = "Scriptable/Enemy")]
public class EnemySO : ScriptableObject {

    public float _playerDist;
    public MinMax _reloadSpeed;
    public MinMax _firstShootDelay;
    public EnemyAIType _aiType;
    public List<MinMax> _shootDelays;
    public float _maxHealth;
    public MinMax _baseDamage;
    public MinMax _speed;
    public WeaponSO _defaultWeapon;
}
public enum EnemyAIType {
    Stupid,
    Normal,
    Advanced,
}
