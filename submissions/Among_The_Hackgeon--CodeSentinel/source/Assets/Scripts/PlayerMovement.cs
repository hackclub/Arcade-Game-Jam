using System;
using System.Collections;
using UnityEngine;

public class PlayerMovement : MonoBehaviour {
    public float _speed;
    public float _dashDuration;
    public float _dashStaminaUsage;
    public float _dashPower;
    public float _maxStamina;
    public float _staminaRegDelay;
    public float _stamRegPerSec;
    private bool _canMove = true;
    private Vector2 _dir;
    private Rigidbody2D _rgb;
    public bool _dashToMouse;
    private float _currentStamina;
    private float _staminaCounter;
    public static Action<float> _onStaminaChange;
    public static Action _onDashStart;
    void Awake() {
        _rgb = GetComponent<Rigidbody2D>();
        var p = GetComponent<PlayerController>();
        p._data._dashDuration._OnStatValueChanged += (x) => _dashDuration = x;
        p._data._movementSpeed._OnStatValueChanged += (x) => _speed = x * GameManager._gSettings._playerSpeedMultiplier;
        p._data._dashPower._OnStatValueChanged += (x) => _dashPower = x;
        p._data._stamRegPerSecMult._OnStatValueChanged += (x) => _stamRegPerSec = x;
        p._data._maxStamina._OnStatValueChanged += (x) => { _maxStamina = x; PlayerUI._I.RefreshDash(_currentStamina, _maxStamina); };
        p._data._dashStaminaUsage._OnStatValueChanged += (x) => _dashStaminaUsage = x;
        p._data._staminaRegenerationDelay._OnStatValueChanged += (x) => _staminaRegDelay = x;
        TickCounter._onTick += (x) => {
            if (_currentStamina < _maxStamina) {
                _currentStamina += 1;
            }
        };

    }
    void Start() {
        _speed += GameManager._gSettings._playerSpeedMultiplier;
        PlayerUI._I.RefreshDash(_currentStamina, _maxStamina); ;
    }



    public void Update() {
        HandleInput();
        HandleStamina();
    }

    private void HandleStamina() {
        if (_currentStamina < _maxStamina) {
            if (_staminaCounter <= 0) {
                _currentStamina += Time.deltaTime * _stamRegPerSec;
                PlayerUI._I.RefreshDash(_currentStamina, _maxStamina); ;
                _onStaminaChange?.Invoke(_currentStamina);
            } else {
                _staminaCounter -= Time.deltaTime;
            }
        }
    }

    private void HandleInput() {
        _dir = new(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        if (Input.GetKeyDown(KeyCode.Mouse1)) if (_dashToMouse) DashToMouse(Camera.main.ScreenToWorldPoint(Input.mousePosition)); else DashForward();
    }
    private void DashForward() {
        if (_dir == Vector2.zero) return;
        if (_currentStamina >= _dashStaminaUsage) {
            _currentStamina -= _dashStaminaUsage;
            _rgb.AddForce(_dir.normalized * _dashPower, ForceMode2D.Impulse);
            StartCoroutine(StopMoving(_dashDuration));
            _staminaCounter = _staminaRegDelay;
            PlayerUI._I.RefreshDash(_currentStamina, _maxStamina); ;
            _onDashStart?.Invoke();
            _onStaminaChange?.Invoke(_currentStamina);
        }
    }
    private void DashToMouse(Vector2 pos) {
        // Vector2 dir = pos - new Vector2(transform.position.x, transform.position.y);
        // if (dir == Vector2.zero || !_canMove) return;
        // Debug.Log(dir.ToString());
        // _rgb.AddForce(dir.normalized * _dashPower, ForceMode2D.Impulse);
        // Debug.Log("dash");
        // StartCoroutine(StopMoving(_dashDuration));
    }

    void FixedUpdate() {
        if (!_canMove) return;
        _rgb.velocity = _dir.normalized * _speed;
    }
    IEnumerator StopMoving(float time) {
        _canMove = false;
        yield return new WaitForSeconds(time);
        _canMove = true;
    }
}
