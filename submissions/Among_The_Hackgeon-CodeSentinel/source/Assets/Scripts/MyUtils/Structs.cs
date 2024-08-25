using System;
using UnityEngine;

namespace MyUtils.Structs {
    [Serializable]
    public struct BulletSetting {
        public Sprite _sprite;
        public int _damage;
        public float _speed;
        public float _maxDist;
    }
    [Serializable]
    public struct StatChangeObject {
        public StatType _name;
        public float _multiplier;
        public float _modifier;
    }
    [Serializable]
    public struct MinMax {
        public float _min;
        public float _max;
        public float GetValue() {
            return UnityEngine.Random.Range(_min, _max);
        }
    }
}