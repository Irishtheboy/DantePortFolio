// Email notification service using EmailJS
export const sendEmailNotification = async (type, data) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_killydid',
        template_id: type === 'booking' ? 'template_booking' : 'template_message',
        user_id: '2e-RBRRMyLYF0sevl',
        template_params: {
          to_email: 'Magamasinethemba@gmail.com',
          from_name: data.name,
          from_email: data.email,
          subject: type === 'booking' ? `New Booking Request - ${data.serviceName}` : `New Message - ${data.subject}`,
          message: type === 'booking' 
            ? `New booking request from ${data.name}\n\nService: ${data.serviceName}\n${data.serviceDescription ? `Description: ${data.serviceDescription}\n` : ''}Date: ${data.date}\n${data.timeSlot ? `Time: ${data.timeSlot}\n` : ''}Location: ${data.location}\nPhone: ${data.phone}\nEmail: ${data.email}\n\nDetails:\n${data.message || 'No additional details provided'}\n\nNote: Custom quote required - contact client for pricing.`
            : `New message from ${data.name}\n\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
          reply_to: data.email
        }
      })
    });

    if (response.ok) {
      console.log('Email notification sent successfully');
      return true;
    } else {
      console.error('Email service responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};