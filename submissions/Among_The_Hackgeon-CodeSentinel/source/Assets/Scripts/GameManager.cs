using System;
using System.Collections;
using System.Collections.Generic;
using MyUtils.Classes;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameManager : MonoBehaviour {
    public static GameSettings _gSettings;
    public static Action _onVolumeChange;
    public GameObject _settings;
    void Awake() {
        try { _gSettings = SaveSystem.Load<GameSettings>(SaveSystem.SETTINGS_DEFAULT_SAVE_PATH, "defaultSettings"); } catch (System.Exception) { }
        if (_gSettings == null) {
            _gSettings = new(0.5f, 0.5f, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 60);
            Debug.Log("Creating Save");
            SaveSettings();
        }
        DontDestroyOnLoad(this.gameObject);
        DontDestroyOnLoad(_help);
        DontDestroyOnLoad(_readme);

    }

    public GameObject _help;
    public GameObject _readme;
    public bool _isReadmeShowed;
    public bool _isPaused;
    public bool _isHelpShowed;
    void Update() {
        if (Input.GetKeyDown(KeyCode.F1)) {
            if (_isHelpShowed) {
                _help.SetActive(false);
                _isHelpShowed = false;
                Unpause();
            } else {
                _isHelpShowed = true;
                _help.SetActive(true);
                Pause();
            }
        }
        if (Input.GetKeyDown(KeyCode.F2)) {
            if (_isPaused) {
                _isPaused = false;
                Unpause();
            } else {
                _isPaused = true;
                Pause();
            }
        }
        if (Input.GetKeyDown(KeyCode.F3)) {
            if (SceneManager.GetActiveScene().buildIndex != 0) {
                LoadStartScreen();
                Cursor.visible = true;
                if (_isHelpShowed) {
                    _help.SetActive(false);
                    _isHelpShowed = false;
                    Unpause();
                }
                if (_isPaused) {
                    _isPaused = false;
                    Unpause();
                }
            }
        }
        if (Input.GetKeyDown(KeyCode.F4)) {
            Exit();
        }
        if (Input.GetKeyDown(KeyCode.F5)) {
            if (SceneManager.GetActiveScene().buildIndex != 0) PlayerController._I.GetComponent<PlayerCombat>().Damage(1000);
        }
        if (Input.GetKeyDown(KeyCode.F6)) {
            if (_isReadmeShowed) {
                _readme.SetActive(false);
                _isReadmeShowed = false;
            } else {
                _isReadmeShowed = true;
                _readme.SetActive(true);
            }
        }
    }
    public void OpenSetting() {
        _settings.SetActive(true);
        try { _gSettings = SaveSystem.Load<GameSettings>(SaveSystem.SETTINGS_DEFAULT_SAVE_PATH, "defaultSettings"); } catch (System.Exception) { }
        // _gSettings ??= new(0.5f, 0.5f, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1);

        values[0].text = _gSettings._musicVolume.ToString("f2"); values[0].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._musicVolume;
        values[1].text = _gSettings._soundsVolume.ToString("f2"); values[1].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._soundsVolume;
        values[2].text = _gSettings._enemySpeedMultiplier.ToString("f2"); values[2].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._enemySpeedMultiplier;
        values[3].text = _gSettings._playerDamageMultiplier.ToString("f2"); values[3].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._playerDamageMultiplier;
        values[4].text = _gSettings._enemyDamageReductionMultiplier.ToString("f2"); values[4].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._enemyDamageReductionMultiplier;
        values[5].text = _gSettings._enemyMaxHealthMultiplier.ToString("f2"); values[5].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._enemyMaxHealthMultiplier;
        values[6].text = _gSettings._specialItemSpawnChange.ToString("f2"); values[6].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._specialItemSpawnChange;
        values[7].text = _gSettings._playerSpeedMultiplier.ToString("f2"); values[7].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._playerSpeedMultiplier;
        values[8].text = _gSettings._playerDamageMultiplier.ToString("f2"); values[8].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._playerDamageMultiplier;
        values[9].text = _gSettings._playerDamageReductionMultiplier.ToString("f2"); values[9].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._playerDamageReductionMultiplier;
        values[10].text = _gSettings._playerMaxHealthMultiplier.ToString("f2"); values[10].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._playerMaxHealthMultiplier;
        values[11].text = _gSettings._timeMultiplier.ToString("f2"); values[11].transform.parent.GetComponentInChildren<Slider>().value = _gSettings._timeMultiplier;
        _frameRateDisplay.text = _gSettings._targetFrameRate.ToString();
    }

    public TextMeshProUGUI _frameRateDisplay;
    public void FrameRateIncrease() {
        _gSettings._targetFrameRate += 10;
        _frameRateDisplay.text = _gSettings._targetFrameRate.ToString();
        Application.targetFrameRate = _gSettings._targetFrameRate;
    }
    public void FrameRateDecrease() {
        _gSettings._targetFrameRate -= 10;
        if (_gSettings._targetFrameRate < 30) _gSettings._targetFrameRate = 30;
        _frameRateDisplay.text = _gSettings._targetFrameRate.ToString();
        Application.targetFrameRate = _gSettings._targetFrameRate;

    }
    public static void Pause() => Time.timeScale = 0;
    public static void Unpause() => Time.timeScale = 1;
    public void LoadGame() => SceneManager.LoadScene(1);
    public void LoadStartScreen() => SceneManager.LoadScene(0);
    public static void Exit() => Application.Quit();

    public void CloseSettingWithoutSaving() => _settings.SetActive(false);
    public void CloseSettingWithSave() {
        _settings.SetActive(false);
        SaveSettings();
    }
    public void SaveSettings() => SaveSystem.Save<GameSettings>(SaveSystem.SETTINGS_DEFAULT_SAVE_PATH, "defaultSettings", _gSettings);

    public TextMeshProUGUI[] values;
    public void RestoreDefault() {
        _gSettings = new(0.5f, 0.5f, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 60);
        for (int i = 0; i < values.Length; i++) {
            var v = 1f;
            if (i < 2) v = 0.5f;
            else if (i == 4 || i == 9) v = 0;
            values[i].text = v.ToString("f2");
            values[i].transform.parent.GetComponentInChildren<Slider>().value = v;
        }
        _frameRateDisplay.text = _gSettings._targetFrameRate.ToString();
        _onVolumeChange?.Invoke();
        _onVolumeChange?.Invoke();
    }
    public void ChangeMusicVolume(float value) { _onVolumeChange?.Invoke(); _gSettings._musicVolume = value; values[0].text = value.ToString("f2"); }
    public void ChangeSoundVolume(float value) { _onVolumeChange?.Invoke(); _gSettings._soundsVolume = value; values[1].text = value.ToString("f2"); }
    public void ChangeEnemySpeed(float value) { _gSettings._enemySpeedMultiplier = value; values[2].text = value.ToString("f2"); }
    public void ChangeEnemyDamage(float value) { _gSettings._enemyDamageMultiplier = value; values[3].text = value.ToString("f2"); }
    public void ChangeEnemyReduction(float value) { _gSettings._enemyDamageReductionMultiplier = value; values[4].text = value.ToString("f2"); }
    public void ChangeEnemyMaxHealth(float value) { _gSettings._enemyMaxHealthMultiplier = value; values[5].text = value.ToString("f2"); }
    public void ChangeSpecialItemSpawnChange(float value) { _gSettings._specialItemSpawnChange = value; values[6].text = value.ToString("f2"); }
    public void ChangePlayerSpeed(float value) { _gSettings._playerSpeedMultiplier = value; values[7].text = value.ToString("f2"); }
    public void ChangePlayerDamage(float value) { _gSettings._playerDamageMultiplier = value; values[8].text = value.ToString("f2"); }
    public void ChangePlayerReduction(float value) { _gSettings._playerDamageReductionMultiplier = value; values[9].text = value.ToString("f2"); }
    public void ChangePlayerMaxHealth(float value) { _gSettings._playerMaxHealthMultiplier = value; values[10].text = value.ToString("f2"); }
    public void ChangeTimeMultiplier(float value) { _gSettings._timeMultiplier = value; values[11].text = value.ToString("f2"); }
}
