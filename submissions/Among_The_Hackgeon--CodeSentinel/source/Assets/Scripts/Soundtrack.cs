using MyUtils.Functions;
using UnityEngine;

public class Soundtrack : MonoBehaviour {
    public static Soundtrack _I;
    public int index;
    public AudioClip[] _defaultSound;
    public AudioClip[] _combatSound;
    public AudioSource _normalSource;
    public AudioSource _loopSource;
    public AudioSource _combatSource;
    public bool _isCombat;
    void Awake() {
        _I = this;
    }
    void Start() {
        RoomController._onCombatStart += PlayCombat;
        RoomController._onCombatEnd += CombatEnd;
        _normalSource.volume = GameManager._gSettings._musicVolume;
        _combatSource.volume = GameManager._gSettings._musicVolume;
        _loopSource.volume = GameManager._gSettings._musicVolume;
        _combatSource.Stop();
        GameManager._onVolumeChange += ChangeVolume;
    }

    public void ChangeVolume() {
        _normalSource.volume = GameManager._gSettings._musicVolume;
        _combatSource.volume = GameManager._gSettings._musicVolume;
        _loopSource.volume = GameManager._gSettings._musicVolume;

    }
    void Update() {
        if (!_normalSource.isPlaying && !_isCombat) {
            PlayNormal();
        }
    }
    public void PlayLoopResetApproach() {
        _loopSource.clip = GameDataManager._I._approachingLoopReset;
        _normalSource.volume = .33f * GameManager._gSettings._musicVolume;
        _combatSource.volume = .33f * GameManager._gSettings._musicVolume;
        _loopSource.Play();
    }
    public void PlayLoopBreak() {
        _loopSource.clip = GameDataManager._I._loopBreak;
        _normalSource.volume = 0 * GameManager._gSettings._musicVolume;
        _combatSource.volume = 0 * GameManager._gSettings._musicVolume;
        _loopSource.Play();

    }

    public void CombatEnd() {
        StopCombat();
    }
    public void PlayBossDie() {
        _loopSource.clip = GameDataManager._I._bossDie;
        _loopSource.Play();

    }
    public void PlayLoopReset() {
        _normalSource.volume = GameManager._gSettings._musicVolume;
        _combatSource.volume = GameManager._gSettings._musicVolume;
        _loopSource.clip = GameDataManager._I._loopResetSound;
        _loopSource.Play();
    }
    public void PlayCombat() {
        Debug.Log("CombatStart");
        _normalSource.Stop();
        _isCombat = true;
        if (_combatSource.clip == null) _combatSource.clip = MyRandom.GetFromArray<AudioClip>(_combatSound);
        _combatSource.Play();
    }
    public void StopCombat() {
        Debug.Log("CombatEnd");
        _combatSource.Stop();
        _isCombat = false;
        _normalSource.Play();
    }
    public void PlayNormal() {
        index++;
        if (index == _defaultSound.Length) index = 0;

        _normalSource.clip = _defaultSound[index];
        _normalSource.Play();
    }
}
