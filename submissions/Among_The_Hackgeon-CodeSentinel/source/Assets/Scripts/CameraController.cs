using UnityEngine;

public class CameraController : MonoBehaviour {

    public Transform _cameraFollow;
    public float _mouseOffset;
    public float _maxMouseOffset;
    public float _speed;
    public Vector3 _cameraOffset;
    void Start() {
        // _initOffset = transform.position - _cameraFollow.position;
    }
    public void LateUpdate() {
        Vector3 mousePos = Camera.main.ScreenToWorldPoint(new(Input.mousePosition.x, Input.mousePosition.y, -10));
        Vector3 targetPos = _cameraFollow.position + _cameraOffset;
        Vector3 mouseOffset = mousePos - targetPos;
        mouseOffset = Vector3.ClampMagnitude(mouseOffset, _maxMouseOffset);
        targetPos += mouseOffset * _mouseOffset;
        transform.position = Vector3.Lerp(transform.position, targetPos, _speed * Time.deltaTime);
    }
}
