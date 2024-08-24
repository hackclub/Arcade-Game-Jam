using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class Timer : MonoBehaviour {
    public string _sceneName;
    public TextMeshProUGUI _display;
    public float _time;
    public static Timer _I;
    private bool _spawned;
    public static Action _reload;
    public static List<GameObject> _objectToDestroy;
    public float _resetTime;
    public float _totalTime;
    public float _playerDeaths;
    void Start() {
        _objectToDestroy = new();
        _I = this;
        _time = _resetTime;
    }
    void Update() {
        _time -= Time.deltaTime;
        _display.text = _time.ToString("f0");
        if (_time < 9 && !_spawned) { Soundtrack._I.PlayLoopResetApproach(); Instantiate(GameDataManager._I._loopResetParticle, PlayerController._I.transform); _spawned = true; }
        if (_time <= 0) LoadScene();
    }
    public void PlayerDie() {
        _playerDeaths += 1;
        LoadScene();
    }
    public bool _broken;
    public void LoadScene() {
        Soundtrack._I.PlayLoopReset();
        _time = _resetTime;
        _spawned = false;
        if (BossUI._I != null ? BossUI._I.gameObject : null != null) Destroy(BossUI._I.transform.parent.gameObject);
        foreach (var v in _objectToDestroy) if (v != null) Destroy(v);
        _objectToDestroy = new();
        _reload?.Invoke();
        // SceneManager.LoadScene(SceneManager.GetActiveScene().name /*== _sceneName ? _sceneName + 1 : _sceneName*/, LoadSceneMode.Single);
    }
    public void BreakLoop() {
        if (_broken) return;
        _time = 999;
        _broken = true;
        StartCoroutine(BreakLoopCoroutine());
    }
    public GameObject _endScreen;
    public GameObject _boomParticle;
    IEnumerator BreakLoopCoroutine() {
        Soundtrack._I.PlayLoopResetApproach();
        Instantiate(GameDataManager._I._loopResetParticle, PlayerController._I.transform);
        yield return new WaitForSeconds(7);
        Instantiate(_boomParticle, PlayerController._I.transform.position, Quaternion.identity);
        yield return new WaitForSeconds(1);
        _endScreen.SetActive(true);
        Soundtrack._I.PlayLoopBreak();
    }

}
