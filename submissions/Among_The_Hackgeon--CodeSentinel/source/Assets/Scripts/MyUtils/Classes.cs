using System;
using System.Collections.Generic;
using Unity.Mathematics;
using UnityEngine;


namespace MyUtils.Classes {
    [Serializable]
    public class PlayerData {
        //Movement
        [Tooltip("")] public PlayerStat _movementSpeed;
        [Tooltip(" ")] public PlayerStat _dashPower;
        [Tooltip("")] public PlayerStat _dashDuration;
        [Tooltip("")] public PlayerStat _staminaRegenerationDelay;
        [Tooltip(" ")] public PlayerStat _stamRegPerSecMult;  // stamina regeneration per second multiplier (I am to lazy to time this every time)
        [Tooltip("")] public PlayerStat _maxStamina;
        [Tooltip("")] public PlayerStat _dashStaminaUsage;
        [Tooltip("")] public PlayerStat _invincibleAfterDash;
        //Defense
        [Tooltip("")] public PlayerStat _maxHealth;
        [Tooltip("")] public PlayerStat _damageIgnore;
        [Tooltip("")] public PlayerStat _damageReduction;
        //Offense
        [Tooltip("")] public PlayerStat _reloadSpeedMult;
        [Tooltip("")] public PlayerStat __bulletSpeedMult;
        [Tooltip("")] public PlayerStat _shootDelayMultiplier;
    }
    [Serializable]
    public class PlayerStat {

        public Action<float> _OnStatValueChanged;
        [SerializeField] float _baseValue;
        [SerializeField][TextArea] string _description;
        private readonly List<float> _modifiers = new();
        private readonly List<float> _multipliers = new();

        public string GetDescription() => _description;
        public float GetBaseValue() => _baseValue;
        public void ChangeBaseValue(float newValue) => _baseValue = newValue;
        public void InvokeOnChangeAction() => _OnStatValueChanged?.Invoke(GetValue());


        public float GetValue() {

            float finalValue;
            finalValue = _baseValue;
            _modifiers.ForEach(x => finalValue += x);
            _multipliers.ForEach(y => finalValue *= y);
            return finalValue;

        }
        public float GetModifiers() {
            float value = 0;
            _modifiers.ForEach(x => value += x);
            return value;
        }

        public float GetMultipliers() {
            float value = 1;
            _multipliers.ForEach(x => value *= x);
            return value;
        }
        public void AddModifier(float modifier) {
            if (modifier != 0) _modifiers.Add(modifier);
            InvokeOnChangeAction();
        }
        public void RemoveModifier(float modifier) {
            if (modifier != 0) _modifiers.Remove(modifier);
            InvokeOnChangeAction();
        }
        public void AddMultiplier(float multiplier) {
            if (multiplier != 0) _multipliers.Add(multiplier);
            InvokeOnChangeAction();
        }
        public void RemoveMultiplier(float multiplier) {
            if (multiplier != 0) _multipliers.Remove(multiplier);
            InvokeOnChangeAction();
        }
        public void ClearAllModifiers() {
            _modifiers.Clear();
            InvokeOnChangeAction();
        }
        public void ClearAllMultipliers() {
            _multipliers.Clear();
            InvokeOnChangeAction();
        }
        public void ClearAll() {
            _modifiers.Clear();
            _multipliers.Clear();
            InvokeOnChangeAction();
        }

    }

    [Serializable]
    public class MyGrid {
        public MyGrid(int2 gS, int2 sP, Sprite defS, Transform parent) {
            _elements = new GameObject[gS.x, gS.y];
            _startPos = sP;
            for (int x = 0; x < _elements.GetLength(0); x++) {
                for (int y = 0; y < _elements.GetLength(1); y++) {
                    var g = new GameObject($"Tile ({x},{y})");
                    SpriteRenderer sR = g.AddComponent<SpriteRenderer>();
                    GridElementHandler gE = g.AddComponent<GridElementHandler>();
                    sR.sprite = defS;
                    if (x == 0 || x == gS.x - 1 || y == 0 || y == gS.y - 1) GenerateWall(gE, sR, x, y);
                    else GenerateFloor(gE, sR, x, y);
                    g.transform.position = new(x, y);
                    g.transform.parent = parent;

                    _elements[x, y] = g;
                }
            }
        }
        void GenerateWall(GridElementHandler gE, SpriteRenderer sR, int x, int y) {
            sR.color = new((float)x / 100, (float)y / 100, (float)(x + y) / 100, 1);
            gE.content = new(x, y, "Wall", false, new());
        }
        void GenerateFloor(GridElementHandler gE, SpriteRenderer sR, int x, int y) {
            sR.color = new((float)x / 20, (float)y / 20, (float)(x + y) / 20, 1);
            gE.content = new(x, y, "Floor", true, new());
        }
        public GameObject[,] _elements;
        public int2 _startPos;
    }

    [Serializable]
    public class GridElement {
        public string _name;
        public bool _isWalkable;
        public GridElement(int x, int y, string n, bool isW, Content c) {
            _pos = new(x, y);
            _content = c;
            _name = n;
            _isWalkable = isW;
        }
        public int2 _pos;
        public Content _content;
    }
    [Serializable]
    public class Content {
        public string _name;
    }
    [Serializable]
    public class GameSettings {
        public GameSettings(float m, float s, float eS, float eD, float eR, float eH, float iS, float pS, float pD, float pR, float pH, float t, int fR) {
            _musicVolume = m;
            _soundsVolume = s;
            _enemySpeedMultiplier = eS;
            _enemyDamageMultiplier = eD;
            _enemyDamageReductionMultiplier = eR;
            _enemyMaxHealthMultiplier = eH;
            _specialItemSpawnChange = iS;
            _playerSpeedMultiplier = pS;
            _playerDamageMultiplier = pD;
            _playerDamageReductionMultiplier = pR;
            _playerMaxHealthMultiplier = pH;
            _timeMultiplier = t;
            _targetFrameRate = fR;
        }
        [Range(0, 1f)] public float _musicVolume;
        [Range(0, 1f)] public float _soundsVolume;
        [Range(0.1f, 3f)] public float _enemySpeedMultiplier;
        [Range(0.1f, 3f)] public float _enemyDamageMultiplier;
        [Range(0f, 1f)] public float _enemyDamageReductionMultiplier;
        [Range(0.1f, 3f)] public float _enemyMaxHealthMultiplier;
        [Range(0.1f, 3f)] public float _specialItemSpawnChange;
        [Range(0.1f, 3f)] public float _playerSpeedMultiplier;
        [Range(0.1f, 3f)] public float _playerDamageMultiplier;
        [Range(0f, 1f)] public float _playerDamageReductionMultiplier;
        [Range(0.1f, 3f)] public float _playerMaxHealthMultiplier;
        [Range(0.1f, 3f)] public float _timeMultiplier;
        public int _targetFrameRate;
    }
    [Serializable]
    public class Weapon {
        public Weapon(WeaponSO def) {
            _defaultSettings = def;
            _bulletsInMagazine = def._maxBullet;
            _reloadTime = def._reloadTime;
            _allBullets = 10 * _bulletsInMagazine;
        }
        public int _bulletsInMagazine;
        public int _allBullets;
        public float _reloadTime;
        public WeaponSO _defaultSettings;
        public float _nextShoot;

        public void Setup(Transform firePoint, SpriteRenderer spriteR) {
            if (firePoint != null) firePoint.localPosition = _defaultSettings._firePointPos;
            spriteR.sprite = _defaultSettings._sprite;
        }
        public void Reload() {
            if (_allBullets >= _defaultSettings._maxBullet) {
                _bulletsInMagazine = _defaultSettings._maxBullet;
                _allBullets -= _bulletsInMagazine;
            } else {
                _bulletsInMagazine = _allBullets;
                _allBullets = 0;
            }
        }
        public void Shoot(float mult) {
            _nextShoot = Time.time + _defaultSettings._shotDelay * mult;
            _bulletsInMagazine -= 1;
        }
    }
    [Serializable]
    public class PlayerSaveData {
        public PlayerData _data;
        public Vector3 _playerPos;
        public RoomController[] _rooms;
        public int _saveIndex;

    }


}
