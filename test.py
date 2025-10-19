import torch
print(torch.version.cuda)       # Should print 12.5
print(torch.cuda.is_available()) # Should print True
print(torch.cuda.get_device_name(0)) # Should print your GTX 1650
