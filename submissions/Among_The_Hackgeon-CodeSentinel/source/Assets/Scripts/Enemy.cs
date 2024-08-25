using System.Collections;
using MyUtils.Classes;
using MyUtils.Functions;
using MyUtils.Interfaces;
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class Enemy : MonoBehaviour, IDamageable {
    public RoomController _currentRoom;
    public EnemySO _defaultSetting;
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
    public bool _spawnedByBoss;

    public void PlaySound(AudioClip clip) {
        _audioSource.clip = clip;
        _audioSource.Play();

    }
    public void Awake() {
        Timer._objectToDestroy.Add(transform.parent.gameObject);
        _weapon = new(_defaultSetting._defaultWeapon);
        _weapon.Setup(null, _weaponSR);
        _target = PlayerController._I.transform;
        _currentHealth = _defaultSetting._maxHealth * GameManager._gSettings._enemyMaxHealthMultiplier;
        _rgb = GetComponent<Rigidbody2D>();
        _weapon._bulletsInMagazine = _weapon._defaultSettings._maxBullet;
        _nextShootTime = Time.time + _defaultSetting._firstShootDelay.GetValue();
        _currentSpeed = _defaultSetting._speed.GetValue() * GameManager._gSettings._enemySpeedMultiplier;
        _audioSource = GetComponent<AudioSource>();
        _audioSource.volume = GameManager._gSettings._soundsVolume;

        PlaySound(GameDataManager._I._enemySpawnSound);
    }
    void Update() {
        RotateWeaponToPlayer();
        if (_nextShootTime < Time.time) Shoot();
        if (_nextMoveDirectionChange > Time.time) return;
        if (Vector2.Distance(_target.position, transform.position) > _defaultSetting._playerDist) {
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
        b._bulletDamage = _defaultSetting._baseDamage.GetValue() * GameManager._gSettings._enemyDamageMultiplier;
        Physics2D.IgnoreCollision(b.GetComponent<Collider2D>(), GetComponent<Collider2D>());
        _weapon.Shoot(1);
        _nextShootTime = Time.time + _defaultSetting._shootDelays[_delayIndex].GetValue();
        _delayIndex++;
        if (_delayIndex >= _defaultSetting._shootDelays.Count) _delayIndex = 0;
        PlaySound(GameDataManager._I.GetWeaponSound(WeaponType.Single));

    }
    private IEnumerator Reload() {
        if (_isReloading) yield return null;
        _isReloading = true;
        yield return new WaitForSeconds(_defaultSetting._reloadSpeed.GetValue());
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
        v -= v * GameManager._gSettings._enemyDamageReductionMultiplier;
        _currentHealth -= v;
        Instantiate(GameDataManager._I._damageParticle, transform.position, Quaternion.identity);
        if (_currentHealth <= 0) Die();
        PlaySound(GameDataManager._I._enemyDamageSound);

    }
    public void Die() {
        Instantiate(_dieParticle, transform.position, Quaternion.identity);
        if (UnityEngine.Random.Range(0f, 1f) < 0.3f * GameManager._gSettings._specialItemSpawnChange) Instantiate(MyRandom.GetFromArray<Transform>(_objectToSpawn), transform.position, Quaternion.identity);
        if (!_spawnedByBoss) _currentRoom._enemies.Remove(this);
        else { Boss._I._enemiesCount -= 1; Boss._I.ChangeName(); };
        Destroy(transform.parent.gameObject);
        PlaySound(GameDataManager._I._enemyDieSound);
    }
    public Transform _dieParticle;
    void OnDestroy() {
        if (!_spawnedByBoss) if (_currentRoom != null) _currentRoom.EnemiesDie();

    }
}
