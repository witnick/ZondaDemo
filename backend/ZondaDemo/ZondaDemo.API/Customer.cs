namespace ZondaDemo.API
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public CustomerDetail Detail { get; set; }
        public List<int> ProductIds { get; set; } = new();
    }
} 