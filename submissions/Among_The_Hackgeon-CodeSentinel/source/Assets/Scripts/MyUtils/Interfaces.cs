namespace MyUtils.Interfaces {
    public interface IDoor {
        public void OpenDoor();
        public void ShowDoor();
        public void CloseDoor();
        public void HideDoor();
    }
    public interface IDamageable {
        public void Damage(float v);
    }
}
