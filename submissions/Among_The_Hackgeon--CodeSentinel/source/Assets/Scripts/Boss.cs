using System.Collections;
using MyUtils.Classes;
using MyUtils.Functions;
using MyUtils.Interfaces;
using UnityEngine;

[RequireComponent(typeof(AudioSource), typeof(BoxCollider2D), typeof(Rigidbody2D))]
public class Boss : MonoBehaviour, IDamageable {
    public static Boss _I;
    public RoomController _currentRoom;
    public BossSO[] _defaultSetting;
    public Weapon _weapon;
    public Transform _target;
    public Transform _firePoint;
    public Transform _weaponHolder;
    public SpriteRenderer _weaponSR;
    public Transform[] _objectToSpawn;
    public Vector2 _moveDirection;
    public float _nextMoveDirectionChange;
    public float _minPlayerDist;
    private Rigidbody2D _rgb;
    private bool _isReloading;
    public Transform _spriteRenderer;
    private int _delayIndex;
    private float _nextShootTime;
    private float _currentHealth;
    private float _currentSpeed;
    public AudioSource _audioSource;
    public int _stage = 0;
    private BossSO _currentStageSO;
    public SpriteRenderer[] _sprites;
    public void PlaySound(AudioClip clip) {
        _audioSource.clip = clip;
        _audioSource.Play();

    }
    public void Start() {
        _I = this;
        NextStage(false);
        Timer._objectToDestroy.Add(gameObject);
        _audioSource = GetComponent<AudioSource>();
        _sprites = GetComponentsInChildren<SpriteRenderer>();
        PlaySound(GameDataManager._I._enemySpawnSound);
        _target = PlayerController._I.transform;
    }
    public int _enemiesCount;
    public void NextStage(bool increase = true) {
        if (increase) _stage++;
        if (_stage == 5) Die();
        _delayIndex = 0;
        _currentStageSO = _defaultSetting[_stage];
        StartInvincible();
        _weapon = new(_currentStageSO._defaultWeapon);
        _weapon.Setup(null, _weaponSR);
        _currentHealth = _currentStageSO._maxHealth;
        _rgb = GetComponent<Rigidbody2D>();
        _weapon._bulletsInMagazine = _weapon._defaultSettings._maxBullet;
        _nextShootTime = Time.time + _currentStageSO._firstShootDelay.GetValue();
        _currentSpeed = _currentStageSO._speed.GetValue();
        BossUI._I.UpdateHealth(_currentHealth, _currentStageSO._maxHealth);
        StartCoroutine(SpawnEnemies());

    }
    public IEnumerator SpawnEnemies() {
        for (int i = 0; i < _currentStageSO._countOfEnemiesToSpawn; i++) {
            var e = Instantiate(MyRandom.GetFromArray<Transform>(_currentStageSO._enemyToSpawn), transform.position + new Vector3(UnityEngine.Random.Range(-2f, 2f), UnityEngine.Random.Range(-2f, 2f)), Quaternion.identity).GetComponentInChildren<Enemy>();
            Instantiate(GameDataManager._I._spawnParticle, e.transform.position, Quaternion.identity);
            e._currentRoom = _currentRoom;
            e._spawnedByBoss = true;
            _enemiesCount += 1;
            BossUI._I.ChangeName(true, _enemiesCount, _stage);
            yield return new WaitForSeconds(0.5f);
            //TODO here!!!

        }
    }
    bool _isInvincible = false;
    public void ChangeName() {
        if (_enemiesCount > 0) BossUI._I.ChangeName(true, _enemiesCount, _stage);
    }
    public void StartInvincible() {
        _isInvincible = true;
        foreach (var r in _sprites) {
            r.color = new Color(r.color.r, r.color.g, r.color.b, 0.1f);
        }
        BossUI._I.ChangeName(true, _enemiesCount, _stage);
    }
    public void StopInvincible() {
        _isInvincible = false;
        foreach (var r in _sprites) {
            r.color = new Color(r.color.r, r.color.g, r.color.b, 1f);
        }
        BossUI._I.ChangeName(false, 0, _stage);

    }
    void Update() {
        RotateWeaponToPlayer();
        if (_isInvincible && _enemiesCount <= 0) StopInvincible();
        if (!_isInvincible && _enemiesCount > 0) StartInvincible();
        if (_nextShootTime < Time.time) Shoot();
        if (_nextMoveDirectionChange > Time.time) return;
        if (Vector2.Distance(_target.position, transform.position) > _currentStageSO._playerDist) {
            _moveDirection = _target.position - transform.position;
            _nextMoveDirectionChange = Time.time + UnityEngine.Random.Range(1f, 2f);
        } else {
            Vector2 newVec = new(Mathf.Clamp(transform.position.x - UnityEngine.Random.Range(-6f, 6f), _currentRoom.transform.position.x - 10, _currentRoom.transform.position.x + 10), Mathf.Clamp(transform.position.y - UnityEngine.Random.Range(-6f, 6f), _currentRoom.transform.position.y - 6, _currentRoom.transform.position.y + 6));
            _moveDirection = newVec - (Vector2)transform.position;
            _nextMoveDirectionChange = Time.time + UnityEngine.Random.Range(1f, 2f);
        }
    }
    void FixedUpdate() {
        _rgb.velocity = _moveDirection.normalized * _currentSpeed;
    }
    public void Shoot() {
        if (_isReloading) return;
        if (_weapon._nextShoot > Time.time) return;
        if (_weapon._bulletsInMagazine <= 0) { StartCoroutine(Reload()); _weapon._allBullets += 30; Debug.Log("No bullets"); return; }
        // Debug.Log("Piu");
        float sp = UnityEngine.Random.Range(0f, _weapon._defaultSettings._spread) * (UnityEngine.Random.Range(0, 2) == 1 ? 1 : -1);
        Quaternion spread = Quaternion.Euler(_weaponHolder.rotation.eulerAngles + new Vector3(0, 0, sp));
        var b = Instantiate(_weapon._defaultSettings._bulletPref, _firePoint.position, spread).GetComponentInChildren<BulletMono>();
        b.Setup(_weapon._defaultSettings._bulletSetting, 1, gameObject.layer, "Enemy");
        b._bulletDamage = _currentStageSO._baseDamage.GetValue();
        Physics2D.IgnoreCollision(b.GetComponent<Collider2D>(), GetComponent<Collider2D>());
        _weapon.Shoot(1);
        _nextShootTime = Time.time + _currentStageSO._shootDelays[_delayIndex].GetValue();
        _delayIndex++;
        if (_delayIndex >= _currentStageSO._shootDelays.Count) _delayIndex = 0;
        PlaySound(GameDataManager._I.GetWeaponSound(WeaponType.Single));

    }
    private IEnumerator Reload() {
        if (_isReloading) yield return null;
        _isReloading = true;
        yield return new WaitForSeconds(_currentStageSO._reloadSpeed.GetValue());
        _weapon.Reload();
        Debug.Log("Reloaded");
        _isReloading = false;
        PlaySound(GameDataManager._I._reloadEndSound);
    }
    private void RotateWeaponToPlayer() {

        Vector2 direction = _target.transform.position - transform.position;
        // direction.Normalize();
        float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
        if (angle < -90 || angle > 90) ChangeLocalScale(-1);
        else ChangeLocalScale(1);
        angle -= 90;
        Quaternion rot = Quaternion.AngleAxis(angle, Vector3.forward);
        _weaponHolder.transform.rotation = Quaternion.Lerp(_weaponHolder.transform.rotation, rot, 100 * Time.deltaTime);
    }
    void ChangeLocalScale(int x) {
        _weaponHolder.transform.GetChild(0).localScale = new(x, 1, 1);
        _spriteRenderer.localScale = new(Mathf.Abs(_spriteRenderer.localScale.x) * x, _spriteRenderer.localScale.y, 1);
    }

    public void Damage(float v) {
        if (_isInvincible) return;
        _currentHealth -= v;
        Instantiate(GameDataManager._I._damageParticle, transform.position, Quaternion.identity);
        if (_currentHealth <= 0) {
            if (_stage < 5) {
                NextStage(); Debug.Log("NextStage"); Instantiate(_dieParticle, transform.position, Quaternion.identity);
            } else Die();
        }
        PlaySound(GameDataManager._I._playerDamageSound);
        BossUI._I.UpdateHealth(_currentHealth, _currentStageSO._maxHealth);

    }
    public void Die() {
        Instantiate(_dieParticle, transform.position, Quaternion.identity);
        Soundtrack._I.PlayBossDie();
        Soundtrack._I.CombatEnd();
        if (UnityEngine.Random.Range(0f, 1f) < 0.2f) Instantiate(MyRandom.GetFromArray<Transform>(_objectToSpawn), transform.position, Quaternion.identity);
        _currentRoom._onRoomClear?.Invoke(_currentRoom);
        PlaySound(GameDataManager._I._enemyDieSound);
        Destroy(transform.parent.gameObject);
    }
    public Transform _dieParticle;
    void OnDestroy() {

        // _currentRoom.EnemiesDie();


    }
}
